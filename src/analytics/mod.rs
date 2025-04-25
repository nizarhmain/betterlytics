use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use md5::{Md5, Digest};
use nanoid::nanoid;

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalyticsEvent {
    /// Site identifier
    site_id: String,
    /// Unique visitor identifier (anonymously generated client-sided)
    visitor_id: String,
    /// Page URL
    url: String,
    /// Referrer URL
    referrer: Option<String>,
    /// User agent
    user_agent: String,
    /// Screen resolution
    screen_resolution: String,
    /// Timestamp of the event
    timestamp: u64,
}

impl AnalyticsEvent {
    pub fn new(
        site_id: String,
        url: String,
        referrer: Option<String>,
        user_agent: String,
        screen_resolution: String,
    ) -> Self {
        // Generate anonymous visitor ID based on browser fingerprint
        let visitor_id = Self::generate_visitor_id(&user_agent, &screen_resolution);
        
        Self {
            site_id,
            visitor_id,
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

    /// Generate an anonymous visitor ID based on browser fingerprint
    fn generate_visitor_id(user_agent: &str, screen_resolution: &str) -> String {
        let mut hasher = Md5::new();
        hasher.update(format!("{}{}", user_agent, screen_resolution));
        format!("{:x}", hasher.finalize())
    }
}

/// Generate a unique site ID
pub fn generate_site_id() -> String {
    nanoid!(12)
} 