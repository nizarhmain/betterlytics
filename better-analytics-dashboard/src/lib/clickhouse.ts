import { ClickHouse } from 'clickhouse';
import { env } from './env';

export const clickhouse = new ClickHouse({
  url: env.CLICKHOUSE_URL,
  isUseGzip: false,
  format: 'json',
}); 