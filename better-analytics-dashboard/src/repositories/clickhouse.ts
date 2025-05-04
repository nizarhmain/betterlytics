import { clickhouse } from '@/lib/clickhouse';
import { DailyPageViewRowSchema, DailyPageViewRow } from '@/entities/pageviews';
import { DailyUniqueVisitorsRow } from '@/entities/pageviews';
import { PageAnalytics } from '@/types/analytics';
import { formatDuration } from '@/utils/timeRanges';

export async function getDailyPageViews(siteId: string, startDate: string, endDate: string): Promise<DailyPageViewRow[]> {
  const query = `
    SELECT date, url, views
    FROM analytics.daily_page_views FINAL
    WHERE site_id = {site_id:String}
      AND date >= {start_date:Date}
      AND date <= {end_date:Date}
    ORDER BY date ASC, views DESC
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

export async function getDailyUniqueVisitors(siteId: string, startDate: string, endDate: string): Promise<DailyUniqueVisitorsRow[]> {
  const query = `
    SELECT
      toStartOfDay(timestamp) as date,
      sum(unique_sessions) as unique_visitors
    FROM analytics.daily_unique_visitors
    WHERE site_id = {site_id:String}
      AND date >= {start:DateTime}
      AND date <= {end:DateTime}
    GROUP BY date
    ORDER BY date ASC
    LIMIT 100
  `;

  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
    },
  }).toPromise() as any[];
  return result.map(row => ({
    date: row.date,
    unique_visitors: Number(row.unique_visitors),
  }));
}

export async function getHourlyPageViews(siteId: string, startDate: string, endDate: string): Promise<DailyPageViewRow[]> {
  const query = `
    SELECT toStartOfHour(timestamp) as date, url, count() as views
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
    GROUP BY date, url
    ORDER BY date ASC, views DESC
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
    ORDER BY date ASC, views DESC
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

export async function getHourlyUniqueVisitors(siteId: string, startDate: string, endDate: string): Promise<DailyUniqueVisitorsRow[]> {
  const query = `
    SELECT
      toStartOfHour(timestamp) as date,
      uniqExact(session_id) as unique_visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
    GROUP BY date
    ORDER BY date ASC
    LIMIT 100
  `;

  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
    },
  }).toPromise() as any[];
  return result.map(row => ({
    date: row.date,
    unique_visitors: Number(row.unique_visitors),
  }));
}

export async function getMinuteUniqueVisitors(siteId: string, startDate: string, endDate: string): Promise<DailyUniqueVisitorsRow[]> {
  const query = `
    SELECT
      toStartOfMinute(timestamp) as date,
      uniqExact(session_id) as unique_visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
    GROUP BY date
    ORDER BY date ASC
    LIMIT 100
  `;

  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
    },
  }).toPromise() as any[];
  return result.map(row => ({
    date: row.date,
    unique_visitors: Number(row.unique_visitors),
  }));
}

export async function getTotalUniqueVisitors(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<number> {
  const query = `
    SELECT uniqExact(session_id) as unique_visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
  `;

  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
    },
  }).toPromise() as any[];
  return Number(result[0]?.unique_visitors ?? 0);
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
    params: { site_id: siteId, start: startDate, end: endDate },
  }).toPromise() as any[];
  return result.map(row => ({ device_type: row.device_type, visitors: Number(row.visitors) }));
}

export async function getSessionMetrics(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<{
  total_sessions: number;
  multi_page_sessions: number;
  total_duration: number;
  avg_duration: number;
}> {
  const query = `
    WITH session_data AS (
      SELECT
        session_id,
        count() as page_count,
        if(count() > 1,
          dateDiff('second', min(timestamp), max(timestamp)),
          0
        ) as duration_seconds
      FROM analytics.events
      WHERE site_id = {site_id:String}
        AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      GROUP BY session_id
    )
    SELECT 
      count() as total_sessions,
      countIf(page_count > 1) as multi_page_sessions,
      sum(duration_seconds) as total_duration_seconds,
      avgIf(duration_seconds, page_count > 1) as avg_duration_seconds
    FROM session_data
  `;
  
  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate
    }
  }).toPromise() as Array<{
    total_sessions: string;
    multi_page_sessions: string;
    total_duration_seconds: string;
    avg_duration_seconds: string;
  }>;
  
  const row = result[0];
  return {
    total_sessions: Number(row?.total_sessions ?? 0),
    multi_page_sessions: Number(row?.multi_page_sessions ?? 0),
    total_duration: Number(row?.total_duration_seconds ?? 0),
    avg_duration: Number(row?.avg_duration_seconds ?? 0)
  };
}

/// https://clickhouse.com/docs/sql-reference/window-functions/leadInFrame
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