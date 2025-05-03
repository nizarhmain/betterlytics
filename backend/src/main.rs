use axum::{
    extract::State,
    http::{header, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
    response::Html,
    extract::ConnectInfo,
    extract::Request,
};
use std::sync::Arc;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tracing::{info, error};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use dotenv::dotenv;
use chrono::{DateTime, Duration, Utc};

mod config;
mod analytics;
mod db;
mod processing;
mod session;

use analytics::{AnalyticsEvent, RawTrackingEvent, generate_site_id};
use db::{Database, SharedDatabase};
use processing::EventProcessor;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let config = config::Config::new();

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(&config.log_level))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let ip_addr = config.server_host.parse::<std::net::IpAddr>()
        .map_err(|e| format!("Invalid server host IP address '{}': {}", config.server_host, e))
        .expect("Failed to parse server host IP address");
    
    let addr = SocketAddr::from((ip_addr, config.server_port));
    info!("Server starting on {}", addr);

    let db = Database::new().await.expect("Failed to initialize database");
    db.validate_schema().await.expect("Invalid database schema");
    let db = Arc::new(db);

    let (processor, mut processed_rx) = EventProcessor::new(db.clone());
    let processor = Arc::new(processor);

    let db_clone = db.clone();
    tokio::spawn(async move {
        while let Some(processed) = processed_rx.recv().await {
            if let Err(e) = db_clone.insert_event(processed).await {
                tracing::error!("Failed to insert processed event: {}", e);
            }
        }
    });

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/ping", get(ping))
        .route("/track", post(track_event))
        .route("/site-id", get(generate_site_id_handler))
        .route("/test", get(|| async { 
            let html = include_str!("../../static/test.html");
            Html(html)
        }))
        .route("/analytics.js", get(|| async {
            let js = include_str!("../../static/analytics.js");
            (StatusCode::OK, js)
        }))
        .with_state((db, processor))
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    info!("Listening on {}", addr);
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>()).await.unwrap();
}

async fn health_check(
    State((db, _)): State<(SharedDatabase, Arc<EventProcessor>)>,
) -> Result<impl IntoResponse, String> {
    match db.check_connection().await {
        Ok(_) => Ok(Json(serde_json::json!({
            "status": "ok",
            "database": "connected"
        }))),
        Err(e) => {
            error!("Database health check failed: {}", e);
            Err(format!("Database connection failed: {}", e))
        }
    }
}

async fn track_event(
    State((_db, processor)): State<(SharedDatabase, Arc<EventProcessor>)>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Json(raw_event): Json<RawTrackingEvent>,
) -> Result<StatusCode, (StatusCode, String)> {
    if raw_event.site_id.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "site_id is required".to_string()));
    }
    if raw_event.url.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "url is required".to_string()));
    }

    let event = AnalyticsEvent::new(raw_event, addr.ip().to_string());

    if let Err(e) = processor.process_event(event).await {
        error!("Failed to process event: {}", e);
        return Ok(StatusCode::OK);
    }

    Ok(StatusCode::OK)
}

/// Ping server - used to detect unique visitor
async fn ping(
    request: Request,
) -> impl IntoResponse {
    let if_modified_since =
        request 
            .headers()
            .get(header::IF_MODIFIED_SINCE)
            .and_then(|header| header.to_str().ok())
            .and_then(|value| DateTime::parse_from_rfc2822(value).ok())
            .and_then(|value| Some(value.with_timezone(&Utc)));

    let last_modified = Utc::now() - Duration::seconds(5);
    
    let cache_threshold_minutes = Duration::minutes(30);

    let is_unqiue_visitor = match if_modified_since {
        Some(last_accessed) => last_modified - last_accessed > cache_threshold_minutes,
        None => true,
    };

    match is_unqiue_visitor {
        true => println!("User is unique!"),
        false => println!("User NOT NEW!"),
    }

    let last_modified_header = [
        (
            header::ACCESS_CONTROL_ALLOW_ORIGIN,
            "*".to_string()
        ),
        (
            header::ACCESS_CONTROL_ALLOW_HEADERS,
            "If-Modified-Since".to_string()
        ),
        (
            header::ACCESS_CONTROL_EXPOSE_HEADERS,
            "Cache-Control, Last-Modified".to_string()
        ),
        (
            header::LAST_MODIFIED,
            last_modified.format("%a, %d %b %Y %H:%M:%S GMT").to_string()
        ),
        (
            header::CACHE_CONTROL,
            "private, max-age=604800".to_string()
        ),
        (
            header::AGE,
            "1".to_string()
        ),
    ];


    let response_status_code = match is_unqiue_visitor {
        true => StatusCode::OK,
        false => StatusCode::NOT_MODIFIED,
    };

    return (
        response_status_code,
        last_modified_header,
        Json(generate_site_id()),
    )
}

/// Temporary endpoint to generate a site ID
async fn generate_site_id_handler() -> impl IntoResponse {
    Json(generate_site_id())
}
