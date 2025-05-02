use maxminddb::{geoip2, Reader};
use std::net::IpAddr;
use std::sync::Arc;
use tracing::{info, warn, error};
use crate::config::Config;
use anyhow::Result;

#[derive(Clone)]
pub struct GeoIpService {
    reader: Option<Arc<Reader<Vec<u8>>>>,
}

impl GeoIpService {
    pub fn new(config: &Config) -> Result<Self> {
        if !config.enable_geolocation {
            info!("Geolocation is disabled via config.");
            return Ok(Self { reader: None });
        }

        let db_path = &config.geoip_db_path;
        if !db_path.exists() {
            warn!("GeoIP database file not found at {:?}. Geolocation will be disabled.", db_path);
            return Ok(Self { reader: None });
        }

        info!("Loading GeoIP database from: {:?}", db_path);
        match Reader::open_readfile(db_path) {
            Ok(reader) => {
                info!("GeoIP database loaded successfully.");
                Ok(Self { reader: Some(Arc::new(reader)) })
            },
            Err(e) => {
                error!("Failed to load GeoIP database from {:?}: {}. Geolocation will be disabled.", db_path, e);
                Ok(Self { reader: None })
            }
        }
    }

    pub fn lookup_country_code(&self, ip_address: &str) -> Option<String> {
        if ip_address == "127.0.0.1" || ip_address == "::1" {
            return Some("Localhost".to_string());
        }

        let reader = self.reader.as_ref()?;
        let ip: IpAddr = ip_address.parse().ok()?;

        match reader.lookup::<geoip2::Country>(ip) {
            Ok(lookup_result) => lookup_result
                .and_then(|geoip_data| geoip_data.country)
                .and_then(|country_data| country_data.iso_code)
                .map(|s| s.to_string()),
            Err(e) => {
                warn!("GeoIP lookup failed for IP {}: {}", ip_address, e);
                None
            }
        }
    }
}
