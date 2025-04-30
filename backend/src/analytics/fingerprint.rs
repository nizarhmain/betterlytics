use std::net::IpAddr;
use chrono::{Utc, Datelike};
use md5::Digest;
use regex::Regex;
use sha2::Sha256;

/// Anonymize IP address by removing last octet
fn anonymize_ip(ip: &str) -> Option<String> {
    if let Ok(ip_addr) = ip.parse::<IpAddr>() {
        match ip_addr {
            IpAddr::V4(ipv4) => {
                let octets = ipv4.octets();
                Some(format!("{}.{}.{}.0", octets[0], octets[1], octets[2]))
            },
            IpAddr::V6(ipv6) => {
                // For IPv6, we'll use the first 64 bits (8 bytes)
                let segments = ipv6.segments();
                Some(format!("{:x}:{:x}:{:x}:{:x}::", 
                    segments[0], segments[1], segments[2], segments[3]))
            }
        }
    } else {
        None
    }
}

/// Bucket screen resolution into small/medium/large
fn bucket_screen_resolution(resolution: &str) -> String {
    if let Some((w, _h)) = resolution.split_once('x') {
        if let Ok(width) = w.trim().parse::<u32>() {
            match width {
                0..=767 => "small".to_string(),
                768..=1023 => "medium".to_string(),
                _ => "large".to_string(),
            }
        } else {
            "unknown".to_string()
        }
    } else {
        "unknown".to_string()
    }
}

/// Extract basic browser name from user agent
fn extract_browser_name(user_agent: &str) -> String {
    let browser_regex = Regex::new(r"(?i)(chrome|safari|firefox|edge|opera)").unwrap();
    if let Some(caps) = browser_regex.captures(user_agent) {
        caps[1].to_lowercase()
    } else {
        "unknown".to_string()
    }
}

/// Generate a daily salt based on the current date
fn generate_daily_salt() -> String {
    let now = Utc::now();
    format!("{}-{}-{}", now.year(), now.month(), now.day())
}

/// Generate a fingerprint for a visitor based on anonymized IP, screen resolution, user agent, and daily rotating salt
pub fn generate_fingerprint(ip: &str, screen_resolution: &str, user_agent: &str) -> String {
    let anonymized_ip = anonymize_ip(ip).unwrap_or_else(|| "unknown".to_string());
    let resolution_bucket = bucket_screen_resolution(screen_resolution);
    let browser_name = extract_browser_name(user_agent);
    let daily_salt = generate_daily_salt();
    
    let mut hasher = Sha256::new();
    hasher.update(format!(
        "{}{}{}{}",
        anonymized_ip,
        resolution_bucket,
        browser_name,
        daily_salt
    ));
    
    let result = hasher.finalize();
    format!("{:x}", result)
} 