import { ClickHouse } from 'clickhouse';
import { env } from './env';

export const clickhouse = new ClickHouse({
  url: env.CLICKHOUSE_URL,
  basicAuth: {
    username: env.CLICKHOUSE_USER,
    password: env.CLICKHOUSE_PASSWORD,
  },
  isUseGzip: false,
  format: 'json',
}); 