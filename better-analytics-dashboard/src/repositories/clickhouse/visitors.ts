import { clickhouse } from '@/lib/clickhouse';
import { DailyUniqueVisitorsRow, DailyUniqueVisitorsRowSchema } from '@/entities/visitors';
import { DateString, DateTimeString } from '@/types/dates';

export async function getDailyUniqueVisitors(siteId: string, startDate: DateString, endDate: DateString): Promise<DailyUniqueVisitorsRow[]> {
  const query = `
    SELECT
      date,
      uniqMerge(unique_visitors) as unique_visitors
    FROM analytics.daily_unique_visitors FINAL
    WHERE site_id = {site_id:String}
      AND date BETWEEN toDate({start:Date}) AND toDate({end:Date})
    GROUP BY date
    ORDER BY date DESC
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

export async function getHourlyUniqueVisitors(siteId: string, startDate: DateTimeString, endDate: DateTimeString): Promise<DailyUniqueVisitorsRow[]> {
  const query = `
    SELECT
      toStartOfHour(timestamp) as date,
      uniqExact(session_id) as unique_visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
    GROUP BY date
    ORDER BY date DESC
    LIMIT 100
  `;

  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
    },
  }).toPromise() as any[];
  
  const mappedResults = result.map(row => ({
    date: row.date,
    unique_visitors: Number(row.unique_visitors),
  }));
  
  return DailyUniqueVisitorsRowSchema.array().parse(mappedResults);
}

export async function getMinuteUniqueVisitors(siteId: string, startDate: DateTimeString, endDate: DateTimeString): Promise<DailyUniqueVisitorsRow[]> {
  const query = `
    SELECT
      toStartOfMinute(timestamp) as date,
      uniqExact(session_id) as unique_visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
    GROUP BY date
    ORDER BY date DESC
    LIMIT 100
  `;

  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
    },
  }).toPromise() as any[];
  
  const mappedResults = result.map(row => ({
    date: row.date,
    unique_visitors: Number(row.unique_visitors),
  }));
  
  return DailyUniqueVisitorsRowSchema.array().parse(mappedResults);
}

export async function getTotalUniqueVisitors(
  siteId: string,
  startDate: DateString,
  endDate: DateString
): Promise<number> {
  const query = `
    SELECT uniqMerge(unique_visitors) as unique_visitors
    FROM analytics.daily_unique_visitors FINAL
    WHERE site_id = {site_id:String}
      AND date BETWEEN toDate({start:Date}) AND toDate({end:Date})
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

export async function getSessionMetrics(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString
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