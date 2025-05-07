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
    pub referrer_source: String,
    pub referrer_source_name: Option<String>,
    pub referrer_search_term: Option<String>,
    pub referrer_url: Option<String>,
    pub user_agent: String,
    pub device_type: String,
    pub country_code: Option<String>,
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
            referrer_source: event.referrer_info.source.as_str().to_string(),
            referrer_source_name: event.referrer_info.source_name,
            referrer_search_term: event.referrer_info.search_term,
            referrer_url: event.referrer_info.url,
            user_agent: event.user_agent,
            device_type: event.device_type,
            country_code: event.country_code,
            timestamp,
            date: timestamp.date_naive(),
        }
    }
}