use anyhow::Result;
use clickhouse::{Client, inserter::Inserter};
use std::env;
use std::time::Duration;
use chrono::{DateTime, Utc};
use tokio::sync::Mutex;
use std::sync::Arc;

pub struct Database {
    client: Client,
    inserter: Option<Inserter<String>>,
}

pub type SharedDatabase = Arc<Mutex<Database>>;

impl Database {
    pub async fn new() -> Result<Self> {
        let database_url = env::var("CLICKHOUSE_URL").unwrap_or_else(|_| "http://localhost:8123".to_string());
        let user = env::var("CLICKHOUSE_USER").unwrap_or_else(|_| "default".to_string());
        let password = env::var("CLICKHOUSE_PASSWORD").unwrap_or_else(|_| "password".to_string());

        let client = Client::default()
            .with_url(database_url)
            .with_user(user)
            .with_password(password)
            .with_database("analytics");

        // Initialize inserter with appropriate settings for analytics
        let inserter = client.inserter("analytics.events")?
            .with_timeouts(Some(Duration::from_secs(5)), Some(Duration::from_secs(20)))
            .with_max_bytes(50_000_000)
            .with_max_rows(100_000)
            .with_period(Some(Duration::from_secs(10)));

        Ok(Self { 
            client,
            inserter: Some(inserter),
        })
    }

    pub async fn init_schema(&self) -> Result<()> {
        // Create analytics database if it doesn't exist
        self.client.query("CREATE DATABASE IF NOT EXISTS analytics").execute().await?;
        
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

        self.materialize_views().await?;
        
        Ok(())
    }

    pub async fn insert_event(&mut self, event: &crate::analytics::AnalyticsEvent) -> Result<()> {
        let inserter = self.inserter.as_mut().ok_or_else(|| anyhow::anyhow!("Inserter not initialized"))?;
        
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

    pub async fn commit_batch(&mut self) -> Result<()> {
        if let Some(inserter) = &mut self.inserter {
            let stats = inserter.commit().await?;
            if stats.rows > 0 {
                tracing::info!(
                    "Inserted batch: {} bytes, {} rows, {} transactions",
                    stats.bytes, stats.rows, stats.transactions
                );
            }
        }
        Ok(())
    }

    pub async fn finalize(&mut self) -> Result<()> {
        if let Some(inserter) = self.inserter.take() {
            let stats = inserter.end().await?;
            tracing::info!(
                "Final batch inserted: {} bytes, {} rows, {} transactions",
                stats.bytes, stats.rows, stats.transactions
            );
        }
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