use anyhow::Result;
use clickhouse::{error::Error as ClickHouseError, inserter::Inserter, Client};
use std::env;
use std::sync::Arc;
use std::time::Duration;

use tokio::sync::mpsc::{self, error::TryRecvError, Receiver};
use tokio::time::timeout;

use crate::processing::ProcessedEvent;

mod models;
pub use models::EventRow;

const NUM_INSERT_WORKERS: usize = 1;
const EVENT_CHANNEL_CAPACITY: usize = 100_000;
const WORKER_CHANNEL_CAPACITY: usize = 10_000;
const INSERTER_TIMEOUT_SECS: u64 = 5;
const INSERTER_PERIOD_SECS: u64 = 10;
const INSERTER_MAX_ROWS: u64 = 100_000;
const INSERTER_MAX_BYTES: u64 = 50 * 1024 * 1024;

pub struct Database {
    client: Client,
    event_tx: mpsc::Sender<ProcessedEvent>,
}

pub type SharedDatabase = Arc<Database>;

impl Database {
    pub async fn new() -> Result<Self> {
        let client = Self::create_client().await?;
        let (event_tx, event_rx) = Self::create_channels();
        let worker_senders = Self::spawn_inserter_workers(client.clone());
        Self::spawn_dispatcher(event_rx, worker_senders);

        Ok(Self { client, event_tx })
    }

    async fn create_client() -> Result<Client> {
        let database_url = env::var("CLICKHOUSE_URL").unwrap_or_else(|_| "http://localhost:8123".to_string());
        println!("Creating ClickHouse client with URL: {}", database_url);
        let client = Client::default().with_url(&database_url);
        println!("ClickHouse client created successfully");
        Ok(client)
    }

    fn create_channels() -> (mpsc::Sender<ProcessedEvent>, mpsc::Receiver<ProcessedEvent>) {
        mpsc::channel(EVENT_CHANNEL_CAPACITY)
    }

    fn spawn_inserter_workers(client: Client) -> Vec<mpsc::Sender<ProcessedEvent>> {
        let mut worker_senders = Vec::with_capacity(NUM_INSERT_WORKERS);

        for i in 0..NUM_INSERT_WORKERS {
            let (worker_tx, worker_rx) = mpsc::channel(WORKER_CHANNEL_CAPACITY);
            worker_senders.push(worker_tx);
            let client_clone = client.clone();
            tokio::spawn(async move {
                if let Err(e) = run_inserter_worker(i, client_clone, worker_rx).await {
                    eprintln!("Worker {}: Error - {}", i, e);
                }
            });
        }
        worker_senders
    }

    fn spawn_dispatcher(
        mut event_rx: mpsc::Receiver<ProcessedEvent>,
        worker_senders: Vec<mpsc::Sender<ProcessedEvent>>,
    ) {
        tokio::spawn(async move {
            let mut worker_index = 0;
            while let Some(event) = event_rx.recv().await {
                if let Err(e) = worker_senders[worker_index].send(event).await {
                    eprintln!(
                        "Dispatcher failed to send event to worker {}: {}",
                        worker_index, e
                    );
                    // TODO: Add logic to handle potentially dead worker (e.g., skip, retry with backoff, remove worker from rotation).
                }
                worker_index = (worker_index + 1) % NUM_INSERT_WORKERS;
            }
            println!("Dispatcher: Event channel closed. Shutting down.");
        });
    }

    pub async fn validate_schema(&self) -> Result<()> {
        println!("Validating database schema");
        self.check_connection().await?;

        let db_exists: u8 = self.client
            .query("SELECT count() FROM system.databases WHERE name = 'analytics'")
            .fetch_one()
            .await?;
        
        if db_exists == 0 {
            println!("[WARNING] Analytics database does not exist. Please run migrations.");
            return Ok(());
        }

        let table_exists: u8 = self.client
            .query("SELECT count() FROM system.tables WHERE database = 'analytics' AND name = 'events'")
            .fetch_one()
            .await?;

        if table_exists == 0 {
            println!("[WARNING] Events table does not exist. Please run migrations.");
            return Ok(());
        }

        println!("Database schema validation successful");
        Ok(())
    }

    pub async fn insert_event(&self, event: ProcessedEvent) -> Result<()> {
        self.event_tx.send(event).await?;
        Ok(())
    }

    async fn materialize_views(&self) -> Result<()> {
        // Create materialized view for daily page views
        self.client
            .query(
                r#"
            CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.daily_page_views
            ENGINE = SummingMergeTree()
            PARTITION BY toYYYYMM(date)
            ORDER BY (site_id, date, url)
            AS SELECT
                site_id,
                date,
                url,
                count() as views
            FROM analytics.events
            GROUP BY site_id, date, url
        "#,
            )
            .execute()
            .await?;

        // Create materialized view for daily unique visitors
        self.client
            .query(
                r#"
            CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.daily_unique_visitors
            ENGINE = AggregatingMergeTree()
            PARTITION BY toYYYYMM(date)
            ORDER BY (site_id, date)
            AS SELECT
                site_id,
                date,
                uniqState(visitor_id) as unique_visitors
            FROM analytics.events
            GROUP BY site_id, date
        "#,
            )
            .execute()
            .await?;

        Ok(())
    }

    pub async fn check_connection(&self) -> Result<()> {
        println!("Checking database connection");
        self.client.query("SELECT 1").execute().await?;
        println!("Database connection check successful");
        Ok(())
    }
}

async fn run_inserter_worker(
    worker_id: usize,
    client: Client,
    mut rx: Receiver<ProcessedEvent>,
) -> Result<(), ClickHouseError> {
    println!(
        "Worker {}: Starting (Inserter Sparse Stream Mode).",
        worker_id
    );

    let mut inserter = client
        .inserter("analytics.events")?
        .with_timeouts(
            Some(Duration::from_secs(INSERTER_TIMEOUT_SECS)),
            None,
        )
        .with_period(Some(Duration::from_secs(INSERTER_PERIOD_SECS)))
        .with_max_rows(INSERTER_MAX_ROWS)
        .with_max_bytes(INSERTER_MAX_BYTES);

    println!("Worker {}: Inserter configured.", worker_id);

    loop {
        let event = match rx.try_recv() {
            Ok(received_event) => received_event,
            Err(TryRecvError::Empty) => {
                // Channel empty, wait for the next event or until the inserter period ends.
                let time_left = inserter
                    .time_left()
                    .unwrap_or_else(|| Duration::from_secs(INSERTER_PERIOD_SECS));

                match timeout(time_left, rx.recv()).await {
                    Ok(Some(received_event)) => received_event,
                    Ok(None) => {
                        println!(
                            "Worker {}: Channel closed during timeout wait. Committing final batch.",
                            worker_id
                        );
                        inserter.commit().await?;
                        break;
                    }
                    Err(_) => {
                        println!(
                            "Worker {}: Idle timeout reached. Committing potentially buffered data.",
                            worker_id
                        );
                        inserter.commit().await?;
                        continue;
                    }
                }
            }
            Err(TryRecvError::Disconnected) => {
                println!(
                    "Worker {}: Channel disconnected. Committing final batch.",
                    worker_id
                );
                break;
            }
        };

        let row = EventRow::from_processed(event);

        tracing::debug!(worker_id = worker_id, site_id = %row.site_id, visitor_id = %row.visitor_id, session_id = %row.session_id, url = %row.url, timestamp = %row.timestamp, "Prepared row for ClickHouse insertion");

        if let Err(e) = inserter.write(&row) {
            eprintln!(
                "Worker {}: Failed to write row to inserter buffer: {}. Row: {:?}",
                worker_id, e, row
            );
            // TODO: Implement retry logic or dead-letter queue for inserter write failures.
            continue;
        }
    }

    println!(
        "Worker {}: Exiting loop. Finalizing inserter.",
        worker_id
    );
    let stats = inserter.end().await?;
    println!(
        "Worker {}: Shutdown complete. Final stats: {:?}",
        worker_id, stats
    );
    Ok(())
} 