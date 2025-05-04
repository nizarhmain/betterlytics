use maxminddb::{geoip2, Reader};
use std::net::IpAddr;
use std::sync::{Arc, Mutex};
use tracing::{info, warn, error, debug};
use crate::config::Config;
use crate::geoip_updater::GeoIpWatchRx;
use anyhow::Result;

#[derive(Clone)]
pub struct GeoIpService {
    geoip_watch_rx: Arc<Mutex<GeoIpWatchRx>>,
    current_reader: Arc<Mutex<Option<Arc<Reader<Vec<u8>>>>>>,
}

impl GeoIpService {
    pub fn new(config: Arc<Config>, geoip_watch_rx: GeoIpWatchRx) -> Result<Self> {
        let mut initial_reader = None;
        if config.enable_geolocation {
            let db_path = &config.geoip_db_path;
            if db_path.exists() {
                info!("Loading initial GeoIP database from: {:?}", db_path);
                match Reader::open_readfile(db_path) {
                    Ok(reader) => {
                        info!("Initial GeoIP database loaded successfully.");
                        initial_reader = Some(Arc::new(reader));
                    }
                    Err(e) => {
                        error!("Failed to load initial GeoIP database from {:?}: {}. Geolocation may be delayed until first update.", db_path, e);
                    }
                }
            } else {
                warn!("Initial GeoIP database file not found at {:?}. Geolocation will be disabled until first update.", db_path);
            }
        } else {
            info!("Geolocation is disabled via config.");
        }

        let rx_mutex = Arc::new(Mutex::new(geoip_watch_rx));

        let current_reader_state = rx_mutex.lock().unwrap().borrow().clone();

        let reader_to_use = current_reader_state.or(initial_reader);

        Ok(Self {
            geoip_watch_rx: rx_mutex,
            current_reader: Arc::new(Mutex::new(reader_to_use)),
        })
    }

    fn update_reader_if_changed(&self) {
        let mut rx_guard = self.geoip_watch_rx.lock().unwrap();

        if rx_guard.has_changed().unwrap_or(false) {
            let latest_reader_option = rx_guard.borrow_and_update().clone();
            debug!("GeoIpService detected database update via watch channel.");
            let mut current_reader_guard = self.current_reader.lock().unwrap();
            *current_reader_guard = latest_reader_option;
        }
    }

    pub fn lookup_country_code(&self, ip_address: &str) -> Option<String> {
        if ip_address == "127.0.0.1" || ip_address == "::1" {
            return Some("Localhost".to_string());
        }

        self.update_reader_if_changed();

        let reader_arc_option = self.current_reader.lock().unwrap().clone();
        let reader = reader_arc_option?;
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
