use std::env;
use std::sync::Arc;

use anyhow::Result;
use r2d2::Pool;
use redis::{Client as RedisClient, Commands};
use lazy_static::lazy_static;
use chrono::DateTime;
use chrono::Utc;
use nanoid::nanoid;

pub const REDIS_SESSION_TIMEOUT_SECS: usize = 30 * 60;
pub const REDIS_KEY_TTL_SECS: usize = 35 * 60;

lazy_static! {
    pub static ref REDIS_POOL: Arc<Pool<RedisClient>> = {
        let redis_url = env::var("REDIS_URL").unwrap_or_else(|_| "redis://localhost:6379".to_string());
        let client = RedisClient::open(redis_url).expect("Failed to create Redis client");
        let pool = Pool::builder()
            .max_size(10) 
            .build(client)
            .expect("Failed to create Redis pool");
        Arc::new(pool)
    };
}

pub fn get_or_create_session_id(
    redis_pool: &Arc<Pool<RedisClient>>,
    site_id: &str,
    visitor_fingerprint: &str,
    timestamp: &DateTime<Utc>,
) -> Result<String> {
    let mut conn = redis_pool.get()?;
    let redis_key = format!("session:{}:{}", site_id, visitor_fingerprint);

    let event_timestamp_unix = timestamp.timestamp() as u64;

    let existing_data: Option<String> = conn.get(&redis_key)?;

    let session_id = match existing_data {
        Some(data) => {
            let parts: Vec<&str> = data.split(':').collect();
            if parts.len() == 2 {
                let existing_session_id = parts[0];
                let last_timestamp_unix: u64 = parts[1].parse().unwrap_or(0);

                if event_timestamp_unix > last_timestamp_unix && 
                    (event_timestamp_unix - last_timestamp_unix) < REDIS_SESSION_TIMEOUT_SECS as u64 {
                        existing_session_id.to_string()
                } else {
                    nanoid!()
                }
            } else {
                nanoid!()
            }
        }
        None => {
            nanoid!()
        }
    };

    let new_data = format!("{}:{}", session_id, event_timestamp_unix);
    conn.set_ex::<_, _, ()>(&redis_key, new_data, REDIS_KEY_TTL_SECS as u64)?;

    Ok(session_id)
}