use chrono::{DateTime, Utc, NaiveDate};
use serde::{Deserialize, Serialize};
use crate::processing::ProcessedEvent;

#[derive(clickhouse::Row, Serialize, Debug, Deserialize)]
pub struct EventRow {
    pub site_id: String,
    pub session_id: String,
    pub visitor_id: String,
    pub url: String,
    pub referrer: Option<String>,
    pub user_agent: String,
    pub device_type: String,
    pub country_code: Option<String>,
    pub browser: String,
    pub os: String,
    #[serde(with = "clickhouse::serde::chrono::datetime")]
    pub timestamp: DateTime<Utc>,
    #[serde(with = "clickhouse::serde::chrono::date")]
    pub date: NaiveDate,
}

impl EventRow {
    pub fn from_processed(event: ProcessedEvent) -> Self {
        let timestamp = event.timestamp;

        Self {
            site_id: event.site_id,
            session_id: event.session_id,
            visitor_id: event.visitor_fingerprint,
            url: event.url,
            referrer: event.referrer,
            user_agent: event.user_agent,
            device_type: event.device_type.unwrap_or_else(|| "unknown".to_string()),
            country_code: event.country_code,
            browser: event.browser.unwrap_or_else(|| "unknown".to_string()),
            os: event.os.unwrap_or_else(|| "unknown".to_string()),
            timestamp,
            date: timestamp.date_naive(),
        }
    }
}