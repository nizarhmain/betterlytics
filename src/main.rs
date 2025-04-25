use axum::{
    routing::get,
    Router,
    extract::Json,
    http::StatusCode,
    response::Json as JsonResponse,
};
use std::net::SocketAddr;
use tower_http::services::ServeDir;
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod analytics;

use analytics::AnalyticsEvent;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = config::Config::new();
    let addr = SocketAddr::from(([127, 0, 0, 1], config.server_port));
    info!("Server starting on {}", addr);

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/track", get(track_event))
        .route("/site-id", get(generate_site_id_handler))
        .nest_service("/static", ServeDir::new("static"));

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    info!("Listening on {}", addr);
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "OK"
}

async fn track_event(Json(event): Json<AnalyticsEvent>) -> StatusCode {
    info!("Tracking event: {:?}", event);
    // TODO: Store the event in ClickHouse
    StatusCode::OK
}

/// Temporary endpoint to generate a site ID
async fn generate_site_id_handler() -> JsonResponse<String> {
    JsonResponse(analytics::generate_site_id())
}
