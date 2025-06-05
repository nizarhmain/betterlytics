import { clickhouse } from '@/lib/clickhouse';
import {
  DailyPageViewRowSchema,
  DailyPageViewRow,
  TotalPageViewsRow,
  TotalPageViewRowSchema,
} from '@/entities/pageviews';
import {
  PageAnalytics,
  PageAnalyticsSchema,
  TopPageRow,
  TopPageRowSchema,
  TopEntryPageRow,
  TopEntryPageRowSchema,
  TopExitPageRow,
  TopExitPageRowSchema,
} from '@/entities/pages';
import { DateString, DateTimeString } from '@/types/dates';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { BAQuery } from '@/lib/ba-query';
import { safeSql, SQL } from '@/lib/safe-sql';
import { QueryFilter } from '@/entities/filter';

export async function getTotalPageViews(
  siteId: string,
  startDate: DateString,
  endDate: DateString,
  granularity: GranularityRangeValues,
  queryFilters: QueryFilter[],
): Promise<TotalPageViewsRow[]> {
  const granularityFunc = BAQuery.getGranularitySQLFunctionFromGranularityRange(granularity);
  const filters = BAQuery.getFilterQuery(queryFilters);

  const query = safeSql`
    SELECT
      ${granularityFunc}(timestamp) as date,
      count() as views
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND event_type = 'pageview' 
      AND date BETWEEN {start_date:DateTime} AND {end_date:DateTime}
      AND ${SQL.AND(filters)}
    GROUP BY date
    ORDER BY date ASC, views DESC
    LIMIT 10080
  `;
  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start_date: startDate,
        end_date: endDate,
      },
    })
    .toPromise()) as unknown[];
  return result.map((row) => TotalPageViewRowSchema.parse(row));
}

export async function getPageViews(
  siteId: string,
  startDate: DateString,
  endDate: DateString,
  granularity: GranularityRangeValues,
): Promise<DailyPageViewRow[]> {
  const granularityFunc = BAQuery.getGranularitySQLFunctionFromGranularityRange(granularity);

  const query = safeSql`
    SELECT
      ${granularityFunc}(timestamp) as date,
      url,
      count() as views
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND event_type = 'pageview' 
      AND date BETWEEN {start_date:DateTime} AND {end_date:DateTime}
    GROUP BY date, url
    ORDER BY date ASC, views DESC
    LIMIT 10080
  `;
  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start_date: startDate,
        end_date: endDate,
      },
    })
    .toPromise()) as unknown[];
  return result.map((row) => DailyPageViewRowSchema.parse(row));
}

export async function getTotalPageviews(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  queryFilters: QueryFilter[],
): Promise<number> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const queryResponse = safeSql`
    SELECT count() as pageviews
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND event_type = 'pageview' 
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND ${SQL.AND(filters)}
  `;
  const result = (await clickhouse
    .query(queryResponse.taggedSql, {
      params: { ...queryResponse.taggedParams, site_id: siteId, start: startDate, end: endDate },
    })
    .toPromise()) as any[];
  return Number(result[0]?.pageviews ?? 0);
}

export async function getTopPages(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  limit = 5,
  queryFilters: QueryFilter[] = [],
): Promise<TopPageRow[]> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const queryResponse = safeSql`
    SELECT
      url,
      uniq(session_id) as visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND event_type = 'pageview' 
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND ${SQL.AND(filters)}
    GROUP BY url
    ORDER BY visitors DESC
    LIMIT {limit:UInt64} 
  `;

  const result = (await clickhouse
    .query(queryResponse.taggedSql, {
      params: {
        ...queryResponse.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
        limit: limit,
      },
    })
    .toPromise()) as any[];

  return result.map((row) => TopPageRowSchema.parse(row));
}

export async function getPageMetrics(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  queryFilters: QueryFilter[],
): Promise<PageAnalytics[]> {
  const filters = BAQuery.getFilterQuery(queryFilters);
  const query = safeSql`
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
          AND event_type = 'pageview' 
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
          AND ${SQL.AND(filters)}
      ),
      session_page_counts AS (
        SELECT session_id, count() as page_count FROM analytics.events
        WHERE site_id = {site_id:String}
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
          AND event_type = 'pageview'
          AND ${SQL.AND(filters)}
        GROUP BY session_id
      ),
      page_aggregates AS (
        SELECT pvd.path, uniq(pvd.session_id) as visitors, count() as pageviews,
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

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
      },
      format: 'JSONEachRow',
    })
    .toPromise()) as any[];

  const mappedResults = result.map((row) => ({
    path: row.path,
    title: row.path,
    visitors: Number(row.visitors),
    pageviews: Number(row.pageviews),
    bounceRate: Number(row.bounceRate ?? 0),
    avgTime: Number(row.avgTime ?? 0),
  }));

  return PageAnalyticsSchema.array().parse(mappedResults);
}

export async function getPageDetailMetrics(
  siteId: string,
  path: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
): Promise<PageAnalytics | null> {
  const query = safeSql`
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
            next_timestamp IS NOT NULL AND timestamp <= next_timestamp, 
            toFloat64(next_timestamp - timestamp),
            NULL
          ) as duration_seconds
        FROM analytics.events
        WHERE site_id = {site_id:String}
          AND url = {path:String}
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      ),
      session_page_counts AS (
        SELECT session_id, count() as page_count FROM analytics.events
        WHERE site_id = {site_id:String} AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
        GROUP BY session_id
      ),
      page_aggregates AS (
        SELECT pvd.path, uniq(pvd.session_id) as visitors, count() as pageviews,
                avgIf(pvd.duration_seconds, pvd.duration_seconds IS NOT NULL) as avg_time_seconds,
                countIf(spc.page_count = 1) as single_page_sessions
        FROM page_view_durations pvd JOIN session_page_counts spc ON pvd.session_id = spc.session_id
        GROUP BY pvd.path
      )
    SELECT path, visitors, pageviews, 
           if(visitors > 0, round(single_page_sessions / visitors * 100, 2), 0) as bounceRate,
            avg_time_seconds as avgTime
    FROM page_aggregates
    LIMIT 1
  `;

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        path: path,
        start: startDate,
        end: endDate,
      },
      format: 'JSONEachRow',
    })
    .toPromise()) as any[];

  if (result.length === 0) {
    return null;
  }

  const row = result[0];
  const mappedResult = {
    path: row.path,
    title: row.path,
    visitors: Number(row.visitors),
    pageviews: Number(row.pageviews),
    bounceRate: Number(row.bounceRate ?? 0),
    avgTime: Number(row.avgTime ?? 0),
  };

  return PageAnalyticsSchema.parse(mappedResult);
}

export async function getPageTrafficTimeSeries(
  siteId: string,
  path: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  granularity: GranularityRangeValues,
): Promise<TotalPageViewsRow[]> {
  const granularityFunc = BAQuery.getGranularitySQLFunctionFromGranularityRange(granularity);

  const query = safeSql`
    SELECT
      ${granularityFunc}(timestamp) as date,
      count() as views
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND url = {path:String}
      AND event_type = 'pageview' 
      AND timestamp BETWEEN {start_date:DateTime} AND {end_date:DateTime}
    GROUP BY date
    ORDER BY date ASC
    LIMIT 10080
  `;

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        path: path,
        start_date: startDate,
        end_date: endDate,
      },
    })
    .toPromise()) as unknown[];

  return result.map((row) => TotalPageViewRowSchema.parse(row));
}

export async function getTopEntryPages(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  limit = 5,
  queryFilters: QueryFilter[] = [],
): Promise<TopEntryPageRow[]> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const queryResponse = safeSql`
    WITH session_first_pages AS (
      SELECT 
        session_id,
        argMin(url, timestamp) as entry_page
      FROM analytics.events
      WHERE site_id = {site_id:String}
        AND event_type = 'pageview' 
        AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
        AND ${SQL.AND(filters)}
      GROUP BY session_id
    )
    SELECT
      entry_page as url,
      uniq(session_id) as visitors
    FROM session_first_pages
    GROUP BY entry_page
    ORDER BY visitors DESC
    LIMIT {limit:UInt64} 
  `;

  const result = (await clickhouse
    .query(queryResponse.taggedSql, {
      params: {
        ...queryResponse.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
        limit: limit,
      },
    })
    .toPromise()) as any[];

  return result.map((row) =>
    TopEntryPageRowSchema.parse({
      url: row.url,
      visitors: Number(row.visitors),
    }),
  );
}

export async function getTopExitPages(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  limit = 5,
  queryFilters: QueryFilter[] = [],
): Promise<TopExitPageRow[]> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const queryResponse = safeSql`
    WITH session_last_pages AS (
      SELECT 
        session_id,
        argMax(url, timestamp) as exit_page
      FROM analytics.events
      WHERE site_id = {site_id:String}
        AND event_type = 'pageview' 
        AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
        AND ${SQL.AND(filters)}
      GROUP BY session_id
    )
    SELECT
      exit_page as url,
      uniq(session_id) as visitors
    FROM session_last_pages
    GROUP BY exit_page
    ORDER BY visitors DESC
    LIMIT {limit:UInt64} 
  `;

  const result = (await clickhouse
    .query(queryResponse.taggedSql, {
      params: {
        ...queryResponse.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
        limit: limit,
      },
    })
    .toPromise()) as any[];

  return result.map((row) => TopExitPageRowSchema.parse(row));
}

export async function getEntryPageAnalytics(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  limit = 100,
  queryFilters: QueryFilter[] = [],
): Promise<PageAnalytics[]> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const query = safeSql`
    WITH 
      session_entry_pages AS (
        SELECT 
          session_id,
          argMin(url, timestamp) as entry_page
        FROM analytics.events
        WHERE site_id = {site_id:String}
          AND event_type = 'pageview' 
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
          AND ${SQL.AND(filters)}
        GROUP BY session_id
      ),
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
            next_timestamp IS NOT NULL AND timestamp <= next_timestamp, 
            toFloat64(next_timestamp - timestamp),
            NULL
          ) as duration_seconds
        FROM analytics.events
        WHERE site_id = {site_id:String}
          AND event_type = 'pageview' 
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
          AND ${SQL.AND(filters)}
      ),
      session_page_counts AS (
        SELECT session_id, count() as page_count FROM analytics.events
        WHERE site_id = {site_id:String}
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
          AND event_type = 'pageview'
          AND ${SQL.AND(filters)}
        GROUP BY session_id
      ),
      entry_page_aggregates AS (
        SELECT 
          sep.entry_page as path, 
          uniq(pvd.session_id) as visitors, 
          count() as pageviews,
          avgIf(pvd.duration_seconds, pvd.duration_seconds IS NOT NULL) as avg_time_seconds,
          countIf(spc.page_count = 1) as single_page_sessions
        FROM session_entry_pages sep
        JOIN page_view_durations pvd ON sep.entry_page = pvd.path AND sep.session_id = pvd.session_id
        JOIN session_page_counts spc ON pvd.session_id = spc.session_id
        GROUP BY sep.entry_page
      )
    SELECT 
      path, 
      visitors, 
      pageviews, 
      if(visitors > 0, round(single_page_sessions / visitors * 100, 2), 0) as bounceRate,
      avg_time_seconds as avgTime
    FROM entry_page_aggregates 
    ORDER BY visitors DESC, pageviews DESC 
    LIMIT {limit:UInt64}
  `;

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
        limit: limit,
      },
      format: 'JSONEachRow',
    })
    .toPromise()) as any[];

  const mappedResults = result.map((row) => ({
    path: row.path,
    title: row.path,
    visitors: Number(row.visitors),
    pageviews: Number(row.pageviews),
    bounceRate: Number(row.bounceRate ?? 0),
    avgTime: Number(row.avgTime ?? 0),
  }));

  return PageAnalyticsSchema.array().parse(mappedResults);
}

export async function getExitPageAnalytics(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  limit = 100,
  queryFilters: QueryFilter[] = [],
): Promise<PageAnalytics[]> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const query = safeSql`
    WITH 
      session_exit_pages AS (
        SELECT 
          session_id,
          argMax(url, timestamp) as exit_page
        FROM analytics.events
        WHERE site_id = {site_id:String}
          AND event_type = 'pageview' 
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
          AND ${SQL.AND(filters)}
        GROUP BY session_id
      ),
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
            next_timestamp IS NOT NULL AND timestamp <= next_timestamp, 
            toFloat64(next_timestamp - timestamp),
            NULL
          ) as duration_seconds
        FROM analytics.events
        WHERE site_id = {site_id:String}
          AND event_type = 'pageview' 
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
          AND ${SQL.AND(filters)}
      ),
      session_page_counts AS (
        SELECT session_id, count() as page_count FROM analytics.events
        WHERE site_id = {site_id:String}
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
          AND event_type = 'pageview'
          AND ${SQL.AND(filters)}
        GROUP BY session_id
      ),
      exit_page_aggregates AS (
        SELECT 
          sep.exit_page as path, 
          uniq(pvd.session_id) as visitors, 
          count() as pageviews,
          avgIf(pvd.duration_seconds, pvd.duration_seconds IS NOT NULL) as avg_time_seconds,
          countIf(spc.page_count = 1) as single_page_sessions
        FROM session_exit_pages sep
        JOIN page_view_durations pvd ON sep.exit_page = pvd.path AND sep.session_id = pvd.session_id
        JOIN session_page_counts spc ON pvd.session_id = spc.session_id
        GROUP BY sep.exit_page
      )
    SELECT 
      path, 
      visitors, 
      pageviews, 
      if(visitors > 0, round(single_page_sessions / visitors * 100, 2), 0) as bounceRate,
      avg_time_seconds as avgTime
    FROM exit_page_aggregates 
    ORDER BY visitors DESC, pageviews DESC 
    LIMIT {limit:UInt64}
  `;

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
        limit: limit,
      },
      format: 'JSONEachRow',
    })
    .toPromise()) as any[];

  const mappedResults = result.map((row) => ({
    path: row.path,
    title: row.path,
    visitors: Number(row.visitors),
    pageviews: Number(row.pageviews),
    bounceRate: Number(row.bounceRate ?? 0),
    avgTime: Number(row.avgTime ?? 0),
  }));

  return PageAnalyticsSchema.array().parse(mappedResults);
}
