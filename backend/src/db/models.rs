use chrono::{DateTime, Utc, NaiveDate};
use serde::{Deserialize, Serialize};

#[derive(clickhouse::Row, Serialize, Debug, Deserialize)]
pub struct EventRow {
    pub site_id: String,
    pub visitor_id: String,
    pub url: String,
    pub referrer: Option<String>,
    pub user_agent: String,
    pub device_type: String,
    #[serde(with = "clickhouse::serde::chrono::datetime")] // this is required for clickhouse-rs to work with DateTime<Utc> https://github.com/ClickHouse/clickhouse-rs/issues/109#issuecomment-2207355587
    pub timestamp: DateTime<Utc>, 
} 