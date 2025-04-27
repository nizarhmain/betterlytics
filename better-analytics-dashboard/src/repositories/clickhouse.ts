import { clickhouse } from '@/lib/clickhouse';
import { DailyPageViewRowSchema, DailyPageViewRow, PageviewsCountRowSchema } from '@/entities/pageviews';

export async function getDailyPageViews(siteId: string): Promise<DailyPageViewRow[]> {
  const query = `
    SELECT date, url, views
    FROM analytics.daily_page_views FINAL
    WHERE site_id = {site_id:String}
    ORDER BY date DESC, views DESC
    LIMIT 100
  `;
  const result = await clickhouse.query(query, { params: { site_id: siteId } }).toPromise() as unknown[];
  return result.map(row => DailyPageViewRowSchema.parse(row));
}

export async function getTotalPageviews(siteId: string): Promise<number> {
  const query = `
    SELECT sum(views) as total
    FROM analytics.daily_page_views
    WHERE site_id = {site_id:String}
  `;
  const result = await clickhouse.query(query, { params: { site_id: siteId } }).toPromise() as unknown[];
  const row = PageviewsCountRowSchema.parse(result[0]);
  return row.total;
} 