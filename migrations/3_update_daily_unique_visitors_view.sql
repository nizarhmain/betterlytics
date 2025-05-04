DROP VIEW IF EXISTS analytics.daily_unique_visitors;

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.daily_unique_visitors
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (site_id, timestamp)
AS SELECT
    site_id,
    timestamp,
    uniqExact(session_id) as unique_sessions
FROM analytics.events
GROUP BY site_id, timestamp;