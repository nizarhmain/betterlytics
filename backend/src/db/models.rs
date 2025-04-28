use chrono::{DateTime, Utc, NaiveDate};
use serde::{Deserialize, Serialize};
use crate::processing::ProcessedEvent;

#[derive(clickhouse::Row, Serialize, Debug, Deserialize)]
pub struct EventRow {
    pub site_id: String,
    pub visitor_id: String,
    pub url: String,
    pub referrer: Option<String>,
    pub user_agent: String,
    pub device_type: String,
    pub country: Option<String>,
    #[serde(with = "clickhouse::serde::chrono::datetime")]
    pub timestamp: DateTime<Utc>,
    #[serde(with = "clickhouse::serde::chrono::date")]
    pub date: NaiveDate,
} 

impl From<ProcessedEvent> for EventRow {
    fn from(event: ProcessedEvent) -> Self {
        let timestamp = DateTime::from_timestamp(event.event.timestamp as i64, 0).unwrap();
        Self {
            site_id: event.event.site_id,
            visitor_id: event.event.visitor_id,
            url: event.event.url,
            referrer: event.event.referrer,
            user_agent: event.event.user_agent,
            device_type: event.device_type,
            country: event.country,
            timestamp,
            date: timestamp.date_naive(),
        }
    }
}