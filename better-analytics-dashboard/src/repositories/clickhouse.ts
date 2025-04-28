import { clickhouse } from '@/lib/clickhouse';
import { DailyPageViewRowSchema, DailyPageViewRow } from '@/entities/pageviews';
import { DailyUniqueVisitorsRowSchema, DailyUniqueVisitorsRow } from '@/entities/pageviews';

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
      start_date: startDate,
      end_date: endDate,
    },
  }).toPromise() as unknown[];
  return result.map(row => DailyUniqueVisitorsRowSchema.parse(row));
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

export async function getHourlyUniqueVisitors(siteId: string, startDate: string, endDate: string): Promise<DailyUniqueVisitorsRow[]> {
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
  const result = await clickhouse.query(query, { params: { site_id: siteId, start: startDate, end: endDate } }).toPromise() as unknown[];
  return result.map(row => {
    const r = row as any;
    return {
      date: r.date,
      unique_visitors: Number(r.unique_visitors),
    };
  });
}

export async function getMinuteUniqueVisitors(siteId: string, startDate: string, endDate: string): Promise<DailyUniqueVisitorsRow[]> {
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
  const result = await clickhouse.query(query, { params: { site_id: siteId, start: startDate, end: endDate } }).toPromise() as unknown[];
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
    params: { site_id: siteId, start: startDate, end: endDate },
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
    params: { site_id: siteId, start: startDate, end: endDate, limit },
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
    params: { site_id: siteId, start: startDate, end: endDate },
  }).toPromise() as any[];
  return result.map(row => ({ device_type: row.device_type, visitors: Number(row.visitors) }));
}

/* 
* This function is used to get the session metrics for a site.
* It is used to get the total number of sessions, the number of multi-page sessions, the total duration of multi-page sessions, and the number of duration counts.
* It utilizes the lagInFrame function to detect session boundaries.
* If the difference between the current timestamp and the previous timestamp is greater than 1800 seconds, then it is considered anew session.
*/
export async function getSessionMetrics(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<{
  total_sessions: number;
  multi_page_sessions: number;
  total_duration: number;
}> {
  const query = `
    WITH session_boundaries AS (
      SELECT 
        site_id,
        visitor_id,
        timestamp,
        -- Detect session boundaries: 1 if new session, 0 if continuation
        if(dateDiff('second', lagInFrame(timestamp) OVER (PARTITION BY site_id, visitor_id ORDER BY timestamp), timestamp) > 1800, 1, 0) as is_new_session
      FROM analytics.events
      WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
    ),
    session_groups AS (
      SELECT 
        site_id,
        visitor_id,
        timestamp,
        -- Create session IDs by summing the new session markers
        sum(is_new_session) OVER (PARTITION BY site_id, visitor_id ORDER BY timestamp) as session_id
      FROM session_boundaries
    ),
    session_metrics AS (
      SELECT 
        site_id,
        visitor_id,
        session_id,
        count() as page_count,
        if(count() > 1, 
           dateDiff('second', min(timestamp), max(timestamp)), 
           0) as duration
      FROM session_groups
      GROUP BY site_id, visitor_id, session_id
    )
    SELECT 
      count() as total_sessions,
      countIf(page_count > 1) as multi_page_sessions,
      sumIf(duration, page_count > 1) as total_duration
    FROM session_metrics
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
    total_duration: string;
  }>;
  
  const row = result[0];
  return {
    total_sessions: Number(row?.total_sessions ?? 0),
    multi_page_sessions: Number(row?.multi_page_sessions ?? 0),
    total_duration: Number(row?.total_duration ?? 0)
  };
} 