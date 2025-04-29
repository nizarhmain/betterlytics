import { clickhouse } from '@/lib/clickhouse';
import { DailyPageViewRowSchema, DailyPageViewRow } from '@/entities/pageviews';
import { DailyUniqueVisitorsRow } from '@/entities/pageviews';
import { PageAnalytics } from '@/types/analytics';
import { ClickHouseQueryBuilder } from './clickhouse/queryBuilder';
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

export async function getDailyUniqueVisitors(siteId: string, startDate: string, endDate: string): Promise<DailyUniqueVisitorsRow[]> {
  const query = new ClickHouseQueryBuilder()
    .withCTEs()
    .addSessionBoundaries()
    .addSessionGroups()
    .setMainQuery(`
      SELECT
        toDate(timestamp) as date,
        uniqExact(visitor_id) as unique_visitors
      FROM session_groups
      GROUP BY date
      ORDER BY date DESC
      LIMIT 100
    `)
    .build();

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
  const query = new ClickHouseQueryBuilder()
    .withCTEs()
    .addSessionBoundaries()
    .addSessionGroups()
    .setMainQuery(`
      SELECT
        toStartOfHour(timestamp) as date,
        uniqExact(visitor_id) as unique_visitors
      FROM session_groups
      GROUP BY date
      ORDER BY date DESC
      LIMIT 100
    `)
    .build();

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
  const query = new ClickHouseQueryBuilder()
    .withCTEs()
    .addSessionBoundaries()
    .addSessionGroups()
    .setMainQuery(`
      SELECT
        toStartOfMinute(timestamp) as date,
        uniqExact(visitor_id) as unique_visitors
      FROM session_groups
      GROUP BY date
      ORDER BY date DESC
      LIMIT 100
    `)
    .build();

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
  const query = new ClickHouseQueryBuilder()
    .withCTEs()
    .addSessionBoundaries()
    .addSessionGroups()
    .setMainQuery(`
      SELECT uniqExact(visitor_id) as unique_visitors
      FROM session_groups
    `)
    .build();

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
  const query = new ClickHouseQueryBuilder()
    .withCTEs()
    .addSessionBoundaries({ additionalColumns: ['url'] })
    .addSessionGroups({ additionalColumns: ['url'] })
    .setMainQuery(`
      SELECT
        url,
        uniqExact(visitor_id) as visitors
      FROM session_groups
      GROUP BY url
      ORDER BY visitors DESC
      LIMIT ${limit}
    `)
    .build();

  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
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
}> {
  const query = new ClickHouseQueryBuilder()
    .withCTEs()
    .addSessionBoundaries()
    .addSessionGroups()
    .addSessionMetrics()
    .setMainQuery(`
      SELECT 
        count() as total_sessions,
        countIf(page_count > 1) as multi_page_sessions,
        sumIf(duration, page_count > 1) as total_duration
      FROM session_metrics
    `)
    .build();
  
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

export async function getPageMetrics(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<PageAnalytics[]> {
  const query = new ClickHouseQueryBuilder()
    .withCTEs()
    .addSessionBoundaries({ additionalColumns: ['url'] })
    .addSessionGroups({ additionalColumns: ['url'] })
    .addSessionMetrics()
    .addPageMetrics()
    .setMainQuery(`
      SELECT
        path,
        visitors,
        pageviews,
        bounce_rate as bounceRate,
        avg_time as avgTime
      FROM page_metrics
    `)
    .build();

  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
    },
  }).toPromise() as any[];

  return result.map(row => ({
    path: row.path,
    title: row.path,
    visitors: Number(row.visitors),
    pageviews: Number(row.pageviews),
    bounceRate: Number(row.bounceRate),
    avgTime: formatDuration(Number(row.avgTime))
  }));
} 