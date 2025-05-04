import { clickhouse } from '@/lib/clickhouse';
import { DailyPageViewRowSchema, DailyPageViewRow } from '@/entities/pageviews';
import { PageAnalytics } from '@/types/analytics';
import { formatDuration } from '@/utils/timeRanges';

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
      start_date: startDate,
      end_date: endDate,
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
    params: { site_id: siteId, start: startDate, end: endDate },
  }).toPromise() as any[];
  return Number(result[0]?.pageviews ?? 0);
}

export async function getHourlyPageViews(siteId: string, startDate: string, endDate: string): Promise<DailyPageViewRow[]> {
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
  const result = await clickhouse.query(query, { params: { site_id: siteId, start: startDate, end: endDate } }).toPromise() as unknown[];
  
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
  const result = await clickhouse.query(query, { params: { site_id: siteId, start: startDate, end: endDate } }).toPromise() as unknown[];
  return result.map(row => {
    const r = row as any;
    return {
      date: r.date,
      url: r.url,
      views: Number(r.views),
    };
  });
}

export async function getTopPages(
  siteId: string,
  startDate: string,
  endDate: string,
  limit = 5
): Promise<{ url: string; visitors: number }[]> {
  const query = `
    SELECT
      url,
      uniqExact(session_id) as visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
    GROUP BY url
    ORDER BY visitors DESC
    LIMIT {limit:UInt64} 
  `;

  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
      limit: limit
    },
  }).toPromise() as any[];

  return result.map(row => ({
    url: row.url,
    visitors: Number(row.visitors)
  }));
}

export async function getPageMetrics(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<PageAnalytics[]> {
  const query = `
    WITH 
      page_view_durations AS (
        SELECT
          session_id,
          url as path,
          timestamp,
          leadInFrame(timestamp) OVER (
              PARTITION BY site_id, session_id 
              ORDER BY timestamp 
              ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
          ) as next_timestamp,
          if(
            // Keep check to prevent negative durations from timestamp precision issues
            next_timestamp IS NOT NULL AND timestamp <= next_timestamp, 
            toFloat64(next_timestamp - timestamp),
            NULL
          ) as duration_seconds
        FROM analytics.events
        WHERE site_id = {site_id:String}
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      ),
      session_page_counts AS (
        SELECT session_id, count() as page_count FROM analytics.events
        WHERE site_id = {site_id:String} AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
        GROUP BY session_id
      ),
      page_aggregates AS (
        SELECT pvd.path, uniqExact(pvd.session_id) as visitors, count() as pageviews,
                avgIf(pvd.duration_seconds, pvd.duration_seconds IS NOT NULL) as avg_time_seconds,
                countIf(spc.page_count = 1) as single_page_sessions
        FROM page_view_durations pvd JOIN session_page_counts spc ON pvd.session_id = spc.session_id
        GROUP BY pvd.path
      )
    SELECT path, visitors, pageviews, 
           if(visitors > 0, round(single_page_sessions / visitors * 100, 2), 0) as bounceRate,
            avg_time_seconds as avgTime
    FROM page_aggregates ORDER BY visitors DESC, pageviews DESC LIMIT 100
  `;
  
  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
    },
    format: 'JSONEachRow',
  }).toPromise() as any[];

  return result.map(row => ({
    path: row.path,
    title: row.path,
    visitors: Number(row.visitors),
    pageviews: Number(row.pageviews),
    bounceRate: Number(row.bounceRate ?? 0),
    avgTime: formatDuration(Number(row.avgTime ?? 0))
  }));
} 