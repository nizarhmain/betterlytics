use anyhow::Result;
use clickhouse::{Client, inserter::Inserter};
use std::env;
use std::time::Duration;
use chrono::{DateTime, Utc, NaiveDate};
use std::sync::Arc;
use tokio::sync::mpsc;
use crate::analytics::AnalyticsEvent;

mod models;
pub use models::EventRow;

const NUM_INSERT_WORKERS: usize = 1;

pub struct Database {
    client: Client,
    event_tx: mpsc::Sender<AnalyticsEvent>,
}

pub type SharedDatabase = Arc<Database>;

impl Database {
    pub async fn new() -> Result<Self> {
        let client = Self::create_client().await?;
        let (event_tx, event_rx) = Self::create_channels();
        let worker_senders = Self::spawn_async_insert_workers(client.clone());
        Self::spawn_dispatcher(event_rx, worker_senders);

        Ok(Self { 
            client,
            event_tx,
        })
    }

    async fn create_client() -> Result<Client> {
        let database_url = env::var("CLICKHOUSE_URL").unwrap_or_else(|_| "http://localhost:8123".to_string());
        
        println!("Creating ClickHouse client with URL: {}", database_url);
        
        let client = Client::default()
            .with_url(&database_url);

        println!("ClickHouse client created successfully");
        Ok(client)
    }

    fn create_channels() -> (mpsc::Sender<AnalyticsEvent>, mpsc::Receiver<AnalyticsEvent>) {
        mpsc::channel(100_000)
    }

    fn spawn_async_insert_workers(client: Client) -> Vec<mpsc::Sender<AnalyticsEvent>> {
        let mut worker_senders: Vec<mpsc::Sender<AnalyticsEvent>> = Vec::new();

        for i in 0..NUM_INSERT_WORKERS {
            let (worker_tx, mut worker_rx) = mpsc::channel(10_000);
            worker_senders.push(worker_tx);

            let client = client.clone();

            tokio::spawn(async move {
                while let Some(event) = worker_rx.recv().await {
                    if let Err(e) = insert_single_event_async(&client, &event).await {
                        eprintln!("Worker {}: Failed async insert: {}. Event: {:?}", i, e, event);
                    }
                }
            });
        }

        worker_senders
    }

    fn spawn_dispatcher(mut event_rx: mpsc::Receiver<AnalyticsEvent>, worker_senders: Vec<mpsc::Sender<AnalyticsEvent>>) {
        tokio::spawn(async move {
            let mut i = 0;
            while let Some(event) = event_rx.recv().await {
                if let Err(e) = worker_senders[i % NUM_INSERT_WORKERS].send(event).await {
                    eprintln!("Dispatcher failed to send event to worker: {}", e);
                }
                i = (i + 1) % NUM_INSERT_WORKERS;
            }
        });
    }

    pub async fn init_schema(&self) -> Result<()> {
        println!("Initializing database schema");
        
        self.check_connection().await?;
        
        println!("Creating analytics database if it doesn't exist");
        self.client.query("CREATE DATABASE IF NOT EXISTS analytics").execute().await?;
        
        println!("Creating events table");
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

        println!("Creating materialized views");
        self.materialize_views().await?;
        
        println!("Database schema initialized successfully");
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

    pub async fn check_connection(&self) -> Result<()> {
        println!("Checking database connection");
        
        self.client.query("SELECT 1").execute().await?;
        
        println!("Database connection check successful");
        Ok(())
    }
}

async fn insert_single_event_async(client: &Client, event: &AnalyticsEvent) -> Result<()> {
    let timestamp = DateTime::<Utc>::from_timestamp(event.timestamp as i64, 0)
        .ok_or_else(|| anyhow::anyhow!("Invalid timestamp: {}", event.timestamp))?;
    
    let row = EventRow {
        site_id: event.site_id.clone(),
        visitor_id: event.visitor_id.clone(),
        url: event.url.clone(),
        referrer: event.referrer.clone(),
        user_agent: event.user_agent.clone(),
        screen_resolution: event.screen_resolution.clone(),
        timestamp,
        date: timestamp.date_naive(),
    };

    let query = format!(
        "INSERT INTO analytics.events (site_id, visitor_id, url, referrer, user_agent, screen_resolution, timestamp, date) SETTINGS async_insert=1, wait_for_async_insert=1 VALUES ('{}', '{}', '{}', {}, '{}', '{}', '{}', '{}')",
        escape_sql_string(&row.site_id),
        escape_sql_string(&row.visitor_id),
        escape_sql_string(&row.url),
        row.referrer.as_ref().map_or_else(|| "NULL".to_string(), |s| format!("'{}'", escape_sql_string(s))),
        escape_sql_string(&row.user_agent),
        escape_sql_string(&row.screen_resolution),
        row.timestamp.format("%Y-%m-%d %H:%M:%S").to_string(),
        row.date.format("%Y-%m-%d").to_string()
    );

    client.query(&query).execute().await?;

    Ok(())
}

fn escape_sql_string(s: &str) -> String {
    s.replace('\'', "\\'")
} 