# better-analytics

Articles on performance:
https://www.highlight.io/blog/lw5-clickhouse-performance-optimization
https://clickhouse.com/docs/operations/overview
https://clickhouse.com/docs/guides/inserting-data
https://clickhouse.com/blog/asynchronous-data-inserts-in-clickhouse
https://clickhouse.com/blog/asynchronous-data-inserts-in-clickhouse#data-needs-to-be-batched-for-optimal-performance

# Kafka?
https://clickhouse.com/docs/integrations/kafka/clickhouse-kafka-connect-sink



# How to run performance script:
## example:
k6 run -e TARGET_URL=http://localhost:3001/track -e VUS=100 -e DURATION=1m k6-perf-test.js