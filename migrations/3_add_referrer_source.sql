ALTER TABLE analytics.events
    ADD COLUMN IF NOT EXISTS referrer_source String DEFAULT 'direct',
    ADD COLUMN IF NOT EXISTS referrer_source_name Nullable(String),
    ADD COLUMN IF NOT EXISTS referrer_search_term Nullable(String),
    ADD COLUMN IF NOT EXISTS referrer_url Nullable(String);

ALTER TABLE analytics.events
    ADD INDEX referrer_source_idx referrer_source TYPE bloom_filter GRANULARITY 3;