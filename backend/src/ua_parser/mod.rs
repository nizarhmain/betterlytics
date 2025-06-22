use uaparser::{UserAgentParser, Parser};
use once_cell::sync::Lazy;
use moka::sync::Cache;
use tracing::{info, debug};

static USER_AGENT_PARSER: Lazy<UserAgentParser> = Lazy::new(|| {
    info!("Initializing user agent parser...");
    
    let regexes_path = "./assets/user_agent_headers/regexes.yaml";
    
    UserAgentParser::builder()
        .with_unicode_support(false)  // Disable unicode since we don't expect any unicode in the user agent
        .with_device(false)          // Disable device parsing since we detect device from screen resolution
        .build_from_yaml(regexes_path)
        .unwrap_or_else(|e| {
            panic!("Failed to initialize user agent parser from {}: {}. Please ensure regexes.yaml is available.", regexes_path, e);
        })
});

static UA_CACHE: Lazy<Cache<String, (String, Option<String>, String)>> = Lazy::new(|| {
    Cache::builder()
        .max_capacity(5_000)
        .time_to_live(std::time::Duration::from_secs(3600))
        .build()
});

#[derive(Debug, Clone)]
pub struct ParsedUserAgent {
    pub browser: String,
    pub browser_version: Option<String>,
    pub os: String,
}

pub fn initialize() {
    info!("Initializing user agent parser and cache...");
    Lazy::force(&USER_AGENT_PARSER);
    Lazy::force(&UA_CACHE);
    info!("User agent parser initialization complete");
}

/// Parse a user agent string and return browser, browser_version, and OS information
pub fn parse_user_agent(user_agent: &str) -> ParsedUserAgent {
    debug!("Parsing user agent: {:?}", user_agent);
    
    if let Some((browser, browser_version, os)) = UA_CACHE.get(user_agent) {
        debug!("User agent cache hit: browser={:?}, version={:?}, os={:?}", browser, browser_version, os);
        return ParsedUserAgent {
            browser,
            browser_version,
            os,
        };
    }
    
    let client = USER_AGENT_PARSER.parse(user_agent);
    
    let browser = client.user_agent.family.to_string();
    let browser_version = client.user_agent.major.map(|v| v.to_string());
    let os = client.os.family.to_string();
    
    UA_CACHE.insert(
        user_agent.to_string(),
        (browser.clone(), browser_version.clone(), os.clone())
    );
    
    debug!("User agent parsed: browser={:?}, version={:?}, os={:?}", browser, browser_version, os);
    
    ParsedUserAgent {
        browser,
        browser_version,
        os,
    }
}