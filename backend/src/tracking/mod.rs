use axum::{
    extract::Request,
    http::{header, HeaderMap}
};
use chrono::{DateTime, Duration, TimeDelta, Utc};

const CACHE_THESHOLD: TimeDelta = Duration::minutes(30);

pub fn is_user_request_unique(request: Request) -> bool {
    let if_modified_since =
        request 
            .headers()
            .get(header::IF_MODIFIED_SINCE)
            .and_then(|header| header.to_str().ok())
            .and_then(|value| DateTime::parse_from_rfc2822(value).ok())
            .and_then(|value| Some(value.with_timezone(&Utc)));
    
    let is_unqiue_visitor = match if_modified_since {
        Some(last_accessed) => Utc::now() - last_accessed > CACHE_THESHOLD,
        None => true,
    };

    return is_unqiue_visitor
}

pub fn get_user_tracking_headers() -> HeaderMap {

    let response_headers = [
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
            Utc::now().format("%a, %d %b %Y %H:%M:%S GMT").to_string()
        ),
        (
            header::CACHE_CONTROL,
            format!("private, max-age={}", CACHE_THESHOLD.num_seconds())
        ),
    ];
    
    
    let reponse_header_iter = response_headers.map(
        |(name, value)| (name, value.parse().unwrap())
    );
    
    return HeaderMap::from_iter(reponse_header_iter);
}
