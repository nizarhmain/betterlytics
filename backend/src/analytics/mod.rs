use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use nanoid::nanoid;

mod fingerprint;
pub use fingerprint::*;

/// Raw tracking data received from the client
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RawTrackingEvent {
    /// Site identifier
    pub site_id: String,
    /// Page URL
    pub url: String,
    /// Referrer URL
    pub referrer: Option<String>,
    /// User agent
    pub user_agent: String,
    /// Screen resolution
    pub screen_resolution: String,
    /// Timestamp of the event
    pub timestamp: u64,
}

impl RawTrackingEvent {
    pub fn new(
        site_id: String,
        url: String,
        referrer: Option<String>,
        user_agent: String,
        screen_resolution: String,
    ) -> Self {
        Self {
            site_id,
            url,
            referrer,
            user_agent,
            screen_resolution,
            timestamp: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        }
    }
}

/// The main analytics event type that includes server-side data
#[derive(Debug, Clone)]
pub struct AnalyticsEvent {
    /// Raw tracking data from the client
    pub raw: RawTrackingEvent,
    /// Client IP address
    pub ip_address: String,
}

impl AnalyticsEvent {
    pub fn new(raw: RawTrackingEvent, ip_address: String) -> Self {
        Self {
            raw,
            ip_address,
        }
    }
}

/// Generate a unique site ID
pub fn generate_site_id() -> String {
    nanoid!(12)
} 