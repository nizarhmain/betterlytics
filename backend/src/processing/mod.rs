use anyhow::Result;
use tokio::sync::mpsc;
use crate::analytics::AnalyticsEvent;
use crate::db::SharedDatabase;
use tracing::{error, debug};

#[derive(Debug, Clone)]
pub struct ProcessedEvent {
    /// Base original event data sent from client through analytics.js script
    pub event: AnalyticsEvent,
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
}

/// Event processor that handles real-time processing
pub struct EventProcessor {
    db: SharedDatabase,
    event_tx: mpsc::Sender<ProcessedEvent>,
}

impl EventProcessor {
    pub fn new(db: SharedDatabase) -> (Self, mpsc::Receiver<ProcessedEvent>) {
        let (event_tx, event_rx) = mpsc::channel(100_000);
        (Self { db, event_tx }, event_rx)
    }

    pub async fn process_event(&self, event: AnalyticsEvent) -> Result<()> {
        let mut processed = ProcessedEvent {
            event,
            anonymized_ip: None,
            is_bot: false,
            country: None,
            city: None,
            browser: None,
            browser_version: None,
            os: None,
            device_type: "unknown".to_string(),
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
        debug!("Parsing user agent: {:?}", processed.event.user_agent);
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
        debug!("Updating real-time metrics!");
        // TODO: Implement real-time metrics update
        debug!("Processed event: {:?}", processed);
        Ok(())
    }
}