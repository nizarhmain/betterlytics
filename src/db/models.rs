use chrono::{DateTime, Utc, NaiveDate};
use serde::Serialize;

#[derive(clickhouse::Row, Serialize)]
pub struct EventRow {
    pub site_id: String,
    pub visitor_id: String,
    pub url: String,
    pub referrer: Option<String>,
    pub user_agent: String,
    pub screen_resolution: String,
    pub timestamp: DateTime<Utc>,
    pub date: NaiveDate,
} 