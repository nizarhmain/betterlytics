import { clickhouse } from '@/lib/clickhouse';
import { DailyPageViewRowSchema, DailyPageViewRow, PageviewsCountRowSchema } from '@/entities/pageviews';
import { DailyUniqueVisitorsRowSchema, DailyUniqueVisitorsRow } from '@/entities/pageviews';
import { toDateTimeString, toDateString } from '@/utils/timeRanges';

export async function getDailyPageViews(siteId: string, startDate: string, endDate: string): Promise<DailyPageViewRow[]> {
  const query = `
    SELECT date, url, views
    FROM analytics.daily_page_views FINAL
    WHERE site_id = {site_id:String}
      AND date >= {start_date:Date}
      AND date <= {end_date:Date}
    ORDER BY date DESC, views DESC
    LIMIT 100
  `;
  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start_date: toDateString(startDate),
      end_date: toDateString(endDate),
    },
  }).toPromise() as unknown[];
  return result.map(row => DailyPageViewRowSchema.parse(row));
}

export async function getTotalPageviews(siteId: string, startDate: string, endDate: string): Promise<number> {
  const query = `
    SELECT count() as pageviews
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
  `;
  const result = await clickhouse.query(query, {
    params: { site_id: siteId, start: toDateTimeString(startDate), end: toDateTimeString(endDate) },
  }).toPromise() as any[];
  return Number(result[0]?.pageviews ?? 0);
}

export async function getDailyUniqueVisitors(siteId: string, startDate: string, endDate: string): Promise<DailyUniqueVisitorsRow[]> {
  const query = `
    SELECT date, uniqMerge(unique_visitors) as unique_visitors
    FROM analytics.daily_unique_visitors FINAL
    WHERE site_id = {site_id:String}
      AND date >= {start_date:Date}
      AND date <= {end_date:Date}
    GROUP BY date
    ORDER BY date DESC
    LIMIT 100
  `;
  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start_date: toDateString(startDate),
      end_date: toDateString(endDate),
    },
  }).toPromise() as unknown[];
  return result.map(row => DailyUniqueVisitorsRowSchema.parse(row));
}

export async function getHourlyPageViews(siteId: string, startDate: string, endDate: string): Promise<DailyPageViewRow[]> {
  const start = toDateTimeString(startDate);
  const end = toDateTimeString(endDate);
  const query = `
    SELECT toStartOfHour(timestamp) as date, url, count() as views
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
    GROUP BY date, url
    ORDER BY date DESC, views DESC
    LIMIT 100
  `;
  const result = await clickhouse.query(query, { params: { site_id: siteId, start, end } }).toPromise() as unknown[];
  
  return result.map(row => {
    const r = row as any;
    return {
      date: r.date,
      url: r.url,
      views: Number(r.views),
    };
  });
}

export async function getMinutePageViews(siteId: string, startDate: string, endDate: string): Promise<DailyPageViewRow[]> {
  const start = toDateTimeString(startDate);
  const end = toDateTimeString(endDate);
  const query = `
    SELECT toStartOfMinute(timestamp) as date, url, count() as views
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
    GROUP BY date, url
    ORDER BY date DESC, views DESC
    LIMIT 100
  `;
  const result = await clickhouse.query(query, { params: { site_id: siteId, start, end } }).toPromise() as unknown[];
  return result.map(row => {
    const r = row as any;
    return {
      date: r.date,
      url: r.url,
      views: Number(r.views),
    };
  });
}

export async function getHourlyUniqueVisitors(siteId: string, startDate: string, endDate: string): Promise<DailyUniqueVisitorsRow[]> {
  const start = toDateTimeString(startDate);
  const end = toDateTimeString(endDate);
  const query = `
    SELECT toStartOfHour(timestamp) as date, uniqExact(visitor_id) as unique_visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
    GROUP BY date
    ORDER BY date DESC
    LIMIT 100
  `;
  const result = await clickhouse.query(query, { params: { site_id: siteId, start, end } }).toPromise() as unknown[];
  return result.map(row => {
    const r = row as any;
    return {
      date: r.date,
      unique_visitors: Number(r.unique_visitors),
    };
  });
}

export async function getMinuteUniqueVisitors(siteId: string, startDate: string, endDate: string): Promise<DailyUniqueVisitorsRow[]> {
  const start = toDateTimeString(startDate);
  const end = toDateTimeString(endDate);
  const query = `
    SELECT toStartOfMinute(timestamp) as date, uniqExact(visitor_id) as unique_visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
    GROUP BY date
    ORDER BY date DESC
    LIMIT 100
  `;
  const result = await clickhouse.query(query, { params: { site_id: siteId, start, end } }).toPromise() as unknown[];
  return result.map(row => {
    const r = row as any;
    return {
      date: r.date,
      unique_visitors: Number(r.unique_visitors),
    };
  });
}

export async function getTotalUniqueVisitors(siteId: string, startDate: string, endDate: string): Promise<number> {
  const query = `
    SELECT uniqExact(visitor_id) as unique_visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
  `;
  const result = await clickhouse.query(query, {
    params: { site_id: siteId, start: toDateTimeString(startDate), end: toDateTimeString(endDate) },
  }).toPromise() as any[];
  return Number(result[0]?.unique_visitors ?? 0);
}

export async function getTopPages(siteId: string, startDate: string, endDate: string, limit = 5): Promise<{ url: string, visitors: number }[]> {
  const query = `
    SELECT url, uniqExact(visitor_id) as visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
    GROUP BY url
    ORDER BY visitors DESC
    LIMIT {limit:UInt32}
  `;
  const result = await clickhouse.query(query, {
    params: { site_id: siteId, start: toDateTimeString(startDate), end: toDateTimeString(endDate), limit },
  }).toPromise() as any[];
  return result.map(row => ({ url: row.url, visitors: Number(row.visitors) }));
}

export async function getDeviceTypeBreakdown(siteId: string, startDate: string, endDate: string): Promise<{ device_type: string, visitors: number }[]> {
  const query = `
    SELECT device_type, uniqExact(visitor_id) as visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
    GROUP BY device_type
    ORDER BY visitors DESC
  `;
  const result = await clickhouse.query(query, {
    params: { site_id: siteId, start: toDateTimeString(startDate), end: toDateTimeString(endDate) },
  }).toPromise() as any[];
  return result.map(row => ({ device_type: row.device_type, visitors: Number(row.visitors) }));
} 