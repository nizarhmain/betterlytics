use anyhow::Result;
use tokio::sync::mpsc;
use crate::analytics::AnalyticsEvent;
use crate::db::SharedDatabase;
use tracing::{error, debug};
use crate::session;
use r2d2::Pool;
use redis::Client as RedisClient;
use std::sync::Arc;

#[derive(Debug, Clone)]
pub struct ProcessedEvent {
    /// Base original event data sent from client through analytics.js script
    pub event: AnalyticsEvent,
    /// Sessionization - new sessions are created if the user has not generated any events in over 30 minutes
    pub session_id: String,
    /// Anonymized IP address (last octet removed) - ip is retrieved from the event metadata
    pub anonymized_ip: Option<String>,
    /// Detected bot status
    pub is_bot: bool,
    /// Geolocation data - Planning to use ip-api.com or maxmind to get this data
    pub country: Option<String>,
    pub city: Option<String>,
    /// Browser information - Parsed from user_agent string
    pub browser: Option<String>,
    pub browser_version: Option<String>,
    /// Operating system - Parsed from user_agent string
    pub os: Option<String>,
    /// Device type (mobile, desktop, tablet) - Parsed from user_agent string
    pub device_type: String,
    pub site_id: String,
    pub visitor_fingerprint: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub url: String,
    pub referrer: Option<String>,
    pub user_agent: String,
}

/// Event processor that handles real-time processing
pub struct EventProcessor {
    db: SharedDatabase,
    event_tx: mpsc::Sender<ProcessedEvent>,
    redis_pool: Arc<Pool<RedisClient>>,
}

impl EventProcessor {
    pub fn new(db: SharedDatabase) -> (Self, mpsc::Receiver<ProcessedEvent>) {
        let (event_tx, event_rx) = mpsc::channel(100_000);
        let redis_pool = session::REDIS_POOL.clone();
        (Self { db, event_tx, redis_pool }, event_rx)
    }

    pub async fn process_event(&self, event: AnalyticsEvent) -> Result<()> {
        let site_id = event.site_id.clone();
        let visitor_fingerprint = event.visitor_id.clone();
        let timestamp = chrono::DateTime::from_timestamp(event.timestamp as i64, 0).unwrap_or_else(|| chrono::Utc::now());
        let url = event.url.clone();
        let referrer = event.referrer.clone();
        let user_agent = event.user_agent.clone();

        let mut processed = ProcessedEvent {
            event,
            session_id: String::new(),
            anonymized_ip: None,
            is_bot: false,
            country: None,
            city: None,
            browser: None,
            browser_version: None,
            os: None,
            device_type: "unknown".to_string(),
            site_id: site_id.clone(),
            visitor_fingerprint: visitor_fingerprint.clone(),
            timestamp: timestamp.clone(),
            url: url.clone(),
            referrer: referrer.clone(),
            user_agent: user_agent.clone(),
        };

        let session_id_result = session::get_or_create_session_id(
            &self.redis_pool, 
            &site_id, 
            &visitor_fingerprint, 
            &timestamp
        );

        match session_id_result {
            Ok(id) => processed.session_id = id,
            Err(e) => {
                error!("Failed to get session ID from Redis: {}. Event processing aborted for: {:?}", e, processed.event);
                return Ok(());
            }
        };

        if let Err(e) = self.anonymize_ip(&mut processed).await {
            error!("Failed to anonymize IP: {}", e);
        }
        
        if let Err(e) = self.detect_bot(&mut processed).await {
            error!("Failed to detect bot: {}", e);
        }

        if let Err(e) = self.detect_device_type_from_resolution(&mut processed).await {
            error!("Failed to detect device type from resolution: {}", e);
        }
        
        if let Err(e) = self.parse_user_agent(&mut processed).await {
            error!("Failed to parse user agent: {}", e);
        }
        
        if let Err(e) = self.update_real_time_metrics(&processed).await {
            error!("Failed to update real-time metrics: {}", e);
        }

        if let Err(e) = self.event_tx.send(processed).await {
            error!("Failed to send processed event: {}", e);
        }

        debug!("Processed event finished!");
        Ok(())
    }

    /// Anonymize IP address by removing last octet
    async fn anonymize_ip(&self, processed: &mut ProcessedEvent) -> Result<()> {
        debug!("Anonymizing IP address!");
        // TODO: Implement IP anonymization
        processed.anonymized_ip = None;
        Ok(())
    }

    /// Detect if the request is from a bot
    async fn detect_bot(&self, processed: &mut ProcessedEvent) -> Result<()> {
        debug!("Detecting bot!");
        // TODO: Implement bot detection
        processed.is_bot = false;
        Ok(())
    }

    /// Parse user agent to extract browser and OS information
    async fn parse_user_agent(&self, processed: &mut ProcessedEvent) -> Result<()> {
        debug!("Parsing user agent: {:?}", processed.user_agent);
        // TODO: Implement user agent parsing
        processed.browser = None;
        processed.browser_version = None;
        processed.os = None;
        Ok(())
    }
    
    async fn detect_device_type_from_resolution(&self, processed: &mut ProcessedEvent) -> Result<()> {
        if let Some((w, _h)) = processed.event.screen_resolution.split_once('x') {
            if let Ok(width) = w.trim().parse::<u32>() {
                match width {
                    0..=575 => processed.device_type = "mobile".to_string(),
                    576..=991 => processed.device_type = "tablet".to_string(),
                    992..=1439 => processed.device_type = "laptop".to_string(),
                    _ => processed.device_type = "desktop".to_string(),
                }
            } else {
                processed.device_type = "unknown".to_string();
            }
        } else {
            processed.device_type = "unknown".to_string();
        }

        Ok(())
    } 

    /// Update real-time metrics in ClickHouse
    async fn update_real_time_metrics(&self, processed: &ProcessedEvent) -> Result<()> {
        debug!("Updating real-time metrics using session_id: {}", processed.session_id);
        // TODO: Implement real-time metrics update
        Ok(())
    }
}