use anyhow::Result;
use clickhouse::{Client, inserter::Inserter};
use std::env;
use std::time::Duration;
use chrono::{DateTime, Utc};
use std::sync::Arc;
use tokio::sync::mpsc;
use crate::analytics::AnalyticsEvent;

const NUM_INSERTER_WORKERS: usize = 4;

pub struct Database {
    client: Client,
    event_tx: mpsc::Sender<AnalyticsEvent>,
}

pub type SharedDatabase = Arc<Database>;

impl Database {
    pub async fn new() -> Result<Self> {
        let client = Self::create_client().await?;
        let (event_tx, event_rx) = Self::create_channels();
        let worker_senders = Self::spawn_workers(client.clone());
        Self::spawn_dispatcher(event_rx, worker_senders);

        Ok(Self { 
            client,
            event_tx,
        })
    }

    async fn create_client() -> Result<Client> {
        let database_url = env::var("CLICKHOUSE_URL").unwrap_or_else(|_| "http://localhost:8123".to_string());
        
        tracing::debug!("Creating ClickHouse client with URL: {}", database_url);
        
        let client = Client::default()
            .with_url(&database_url);

        tracing::debug!("ClickHouse client created successfully");
        Ok(client)
    }

    fn create_channels() -> (mpsc::Sender<AnalyticsEvent>, mpsc::Receiver<AnalyticsEvent>) {
        mpsc::channel(100_000)
    }

    // Creates per-worker internal channels and starts them
    fn spawn_workers(client: Client) -> Vec<mpsc::Sender<AnalyticsEvent>> {
        let mut worker_senders: Vec<mpsc::Sender<AnalyticsEvent>> = Vec::new();

        for _ in 0..NUM_INSERTER_WORKERS {
            let (worker_tx, mut worker_rx) = mpsc::channel(10_000);
            worker_senders.push(worker_tx);

            let client = client.clone();

            tokio::spawn(async move {
                let mut inserter = client
                    .inserter("analytics.events")
                    .expect("Failed to create inserter")
                    .with_timeouts(Some(Duration::from_secs(5)), Some(Duration::from_secs(20)))
                    .with_max_bytes(50_000_000)
                    .with_max_rows(100_000)
                    .with_period(Some(Duration::from_secs(10)));

                while let Some(event) = worker_rx.recv().await {
                    if let Err(e) = process_event(&mut inserter, &event).await {
                        tracing::error!("Failed to process event: {}", e);
                    }
                }

                if let Err(e) = inserter.end().await {
                    tracing::error!("Failed to finalize inserter: {}", e);
                }
            });
        }

        worker_senders
    }

    // Dispatcher task: pull from main rx and send to workers in round-robin fashion
    fn spawn_dispatcher(mut event_rx: mpsc::Receiver<AnalyticsEvent>, worker_senders: Vec<mpsc::Sender<AnalyticsEvent>>) {
        tokio::spawn(async move {
            let mut i = 0;
            while let Some(event) = event_rx.recv().await {
                if let Err(e) = worker_senders[i % NUM_INSERTER_WORKERS].send(event).await {
                    tracing::error!("Failed to dispatch event to worker: {}", e);
                }
                i += 1;
            }
        });
    }

    pub async fn init_schema(&self) -> Result<()> {
        tracing::debug!("Initializing database schema");
        
        // Test connection with a simple query
        tracing::debug!("Testing connection with a simple query");
        self.client.query("SELECT 1").execute().await?;
        
        // Create analytics database if it doesn't exist
        tracing::debug!("Creating analytics database if it doesn't exist");
        self.client.query("CREATE DATABASE IF NOT EXISTS analytics").execute().await?;
        
        tracing::debug!("Creating events table");
        // Create events table
        self.client.query(r#"
            CREATE TABLE IF NOT EXISTS analytics.events (
                site_id String,
                visitor_id String,
                url String,
                referrer Nullable(String),
                user_agent String,
                screen_resolution String,
                timestamp DateTime,
                -- Add date column for partitioning
                date Date DEFAULT toDate(timestamp)
            ) ENGINE = MergeTree()
            -- Partition by month for better data management
            PARTITION BY toYYYYMM(date)
            -- Order by site_id and timestamp for faster queries
            ORDER BY (site_id, timestamp, visitor_id)
            -- Add compression settings
            SETTINGS index_granularity = 8192,
                     min_bytes_for_wide_part = 0,
                     min_rows_for_wide_part = 0
        "#).execute().await?;

        tracing::debug!("Creating materialized views");
        self.materialize_views().await?;
        
        tracing::debug!("Database schema initialized successfully");
        Ok(())
    }

    pub async fn insert_event(&self, event: AnalyticsEvent) -> Result<()> {
        self.event_tx.send(event).await?;
        Ok(())
    }

    async fn materialize_views(&self) -> Result<()> {
        // Create materialized view for daily page views
        self.client.query(r#"
            CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.daily_page_views
            ENGINE = SummingMergeTree()
            PARTITION BY toYYYYMM(date)
            ORDER BY (site_id, date, url)
            AS SELECT
                site_id,
                toDate(timestamp) as date,
                url,
                count() as views
            FROM analytics.events
            GROUP BY site_id, date, url
        "#).execute().await?;

        // Create materialized view for daily unique visitors
        self.client.query(r#"
            CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.daily_unique_visitors
            ENGINE = AggregatingMergeTree()
            PARTITION BY toYYYYMM(date)
            ORDER BY (site_id, date)
            AS SELECT
                site_id,
                toDate(timestamp) as date,
                uniqState(visitor_id) as unique_visitors
            FROM analytics.events
            GROUP BY site_id, date
        "#).execute().await?;

        Ok(())
    }
}

async fn process_event(inserter: &mut Inserter<String>, event: &AnalyticsEvent) -> Result<()> {
    inserter.write(&event.site_id)?;
    inserter.write(&event.visitor_id)?;
    inserter.write(&event.url)?;
    
    match &event.referrer {
        Some(referrer) => inserter.write(referrer)?,
        None => inserter.write(&String::new())?,
    }
    
    inserter.write(&event.user_agent)?;
    inserter.write(&event.screen_resolution)?;
    
    let timestamp_str = DateTime::<Utc>::from_timestamp(event.timestamp as i64, 0)
        .ok_or_else(|| anyhow::anyhow!("Invalid timestamp"))?
        .format("%Y-%m-%d %H:%M:%S")
        .to_string();
    inserter.write(&timestamp_str)?;

    Ok(())
} 