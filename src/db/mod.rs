use anyhow::Result;
use clickhouse::Client;
use std::env;
use chrono::{DateTime, Utc};

pub struct Database {
    client: Client,
}

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

        Ok(Self { client })
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

    pub async fn insert_event(&self, event: &crate::analytics::AnalyticsEvent) -> Result<()> {
        let mut insert = self.client.insert("analytics.events")?;
        
        insert.write(&event.site_id).await?;
        insert.write(&event.visitor_id).await?;
        insert.write(&event.url).await?;
        
        match &event.referrer {
            Some(referrer) => insert.write(referrer).await?,
            None => insert.write(&String::new()).await?,
        }
        
        insert.write(&event.user_agent).await?;
        insert.write(&event.screen_resolution).await?;
        
        let timestamp_str = DateTime::<Utc>::from_timestamp(event.timestamp as i64, 0)
            .ok_or_else(|| anyhow::anyhow!("Invalid timestamp"))?
            .format("%Y-%m-%d %H:%M:%S")
            .to_string();
        insert.write(&timestamp_str).await?;
        
        insert.end().await?;

        Ok(())
    }
} 