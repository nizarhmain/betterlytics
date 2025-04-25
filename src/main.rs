use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::net::SocketAddr;
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use std::collections::HashMap;
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod analytics;
mod db;

use analytics::{AnalyticsEvent, generate_site_id};
use db::Database;

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

    let db = Database::new().await.expect("Failed to initialize database");
    db.init_schema().await.expect("Failed to initialize database schema");
    let db = Arc::new(db);

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/track", post(track_event))
        .route("/site-id", get(generate_site_id_handler))
        .with_state(db)
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    info!("Listening on {}", addr);
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "OK"
}

async fn track_event(
    State(db): State<Arc<Database>>,
    Json(event): Json<AnalyticsEvent>,
) -> Result<StatusCode, (StatusCode, String)> {
    if let Err(e) = db.insert_event(&event).await {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string()));
    }
    Ok(StatusCode::OK)
}

/// Temporary endpoint to generate a site ID
async fn generate_site_id_handler() -> impl IntoResponse {
    Json(generate_site_id())
}
