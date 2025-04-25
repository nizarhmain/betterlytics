FROM clickhouse/clickhouse-server:latest

EXPOSE 8123 9000 9009

RUN mkdir -p /var/lib/clickhouse/data /var/lib/clickhouse/metadata

RUN chown -R clickhouse:clickhouse /var/lib/clickhouse

USER clickhouse

CMD ["clickhouse-server"] 