import { ClickHouse } from 'clickhouse';
import { env } from './env';

export const clickhouse = new ClickHouse({
  url: env.CLICKHOUSE_URL,
  user: env.CLICKHOUSE_DASHBOARD_USER,
  password: env.CLICKHOUSE_DASHBOARD_PASSWORD,
  isUseGzip: false,
  format: 'json',
});
