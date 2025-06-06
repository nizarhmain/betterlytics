import {
  ReferrerSourceAggregation,
  ReferrerSourceAggregationSchema,
  ReferrerSummary,
  ReferrerSummarySchema,
  ReferrerTrafficBySourceRow,
  ReferrerTrafficBySourceRowSchema,
  TopReferrerUrl,
  TopReferrerUrlSchema,
  TopChannel,
  TopChannelSchema,
  TopReferrerSource,
  TopReferrerSourceSchema,
} from '@/entities/referrers';
import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from '@/types/dates';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { BAQuery } from '@/lib/ba-query';
import { safeSql, SQL } from '@/lib/safe-sql';
import { QueryFilter } from '@/entities/filter';

/**
 * Get the distribution of referrers by source type using unique sessions
 */
export async function getReferrerDistribution(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  queryFilters: QueryFilter[],
): Promise<ReferrerSourceAggregation[]> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const query = safeSql`
    SELECT 
      referrer_source,
      uniq(session_id) as visitorCount
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
      AND referrer_source != 'internal'
      AND ${SQL.AND(filters)}
    GROUP BY referrer_source
    ORDER BY visitorCount DESC
  `;

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
      },
    })
    .toPromise()) as any[];

  return ReferrerSourceAggregationSchema.array().parse(result);
}

/**
 * Get the traffic trend for referrers grouped by source with specified granularity
 */
export async function getReferrerTrafficTrendBySource(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  granularity: GranularityRangeValues,
  queryFilters: QueryFilter[],
): Promise<ReferrerTrafficBySourceRow[]> {
  const granularityFunc = BAQuery.getGranularitySQLFunctionFromGranularityRange(granularity);
  const filters = BAQuery.getFilterQuery(queryFilters);

  const query = safeSql`
    SELECT 
      ${granularityFunc}(timestamp) as date,
      referrer_source,
      uniq(session_id) as count
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND referrer_source != 'internal'
      AND ${SQL.AND(filters)}
    GROUP BY date, referrer_source
    ORDER BY date ASC, count DESC
  `;

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
      },
    })
    .toPromise()) as any[];

  return ReferrerTrafficBySourceRowSchema.array().parse(result);
}

/**
 * Get summary data about referrers including referral sessions, total sessions,
 * top referrer source, and average session duration
 */
export async function getReferrerSummary(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  queryFilters: QueryFilter[],
): Promise<ReferrerSummary> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const query = safeSql`
    WITH session_durations AS (
      SELECT 
        session_id,
        referrer_source,
        max(timestamp) - min(timestamp) as session_duration_seconds
      FROM analytics.events
      WHERE site_id = {site_id:String}
        AND timestamp >= {start:DateTime}
        AND timestamp <= {end:DateTime}
        AND ${SQL.AND(filters)}
      GROUP BY session_id, referrer_source
    ),
    
    referrer_source_counts AS (
      SELECT 
        referrer_source,
        uniq(session_id) as session_count
      FROM analytics.events
      WHERE site_id = {site_id:String}
        AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
        AND referrer_source != 'direct'
        AND referrer_source != 'internal'
        AND ${SQL.AND(filters)}
      GROUP BY referrer_source
      ORDER BY session_count DESC
      LIMIT 1
    )
    
    SELECT
      -- Total sessions across all traffic
      (SELECT uniq(session_id) FROM analytics.events 
        WHERE site_id = {site_id:String} 
        AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
        AND ${SQL.AND(filters)}) as totalSessions,
      
      -- Referral sessions (excluding direct and internal)
      uniq(e.session_id) as referralSessions,
      
      -- Top referrer source
      (SELECT referrer_source FROM referrer_source_counts LIMIT 1) as topReferrerSource,
      
      -- Average session duration for referral traffic (in seconds)
      avg(sd.session_duration_seconds) as avgSessionDuration
      
    FROM analytics.events e
    LEFT JOIN session_durations sd ON e.session_id = sd.session_id
    WHERE e.site_id = {site_id:String}
      AND e.timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND e.referrer_source != 'direct'
      AND e.referrer_source != 'internal'
      AND ${SQL.AND(filters)}
  `;

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
      },
    })
    .toPromise()) as any[];

  const summary = {
    referralSessions: Number(result[0]?.referralSessions) || 0,
    totalSessions: Number(result[0]?.totalSessions) || 0,
    topReferrerSource: result[0]?.topReferrerSource || 'N/A',
    avgSessionDuration: Number(result[0]?.avgSessionDuration) || 0,
  };

  return ReferrerSummarySchema.parse(summary);
}

/**
 * Get detailed referrer data for the table display
 * Including visits, bounce rate, and visit duration by referrer source
 */
export async function getReferrerTableData(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  queryFilters: QueryFilter[],
  limit: number = 100,
): Promise<any[]> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const query = safeSql`
    WITH session_data AS (
      SELECT
        session_id,
        referrer_source as source_type,
        referrer_source_name as source_name,
        referrer_url as source_url,
        count() as page_count,
        if(count() > 1,
          dateDiff('second', min(timestamp), max(timestamp)),
          0
        ) as duration_seconds
      FROM analytics.events
      WHERE site_id = {site_id:String}
        AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
        AND referrer_source != 'internal'
        AND ${SQL.AND(filters)}
      GROUP BY session_id, source_type, source_name, source_url
    )
    SELECT 
      source_type,
      source_name,
      source_url,
      count() as visits,
      if(count() > 0, 
        round((count() - countIf(page_count > 1)) / count() * 100, 1), 
        0
      ) as bounce_rate,
      if(countIf(page_count > 1) > 0,
        avgIf(duration_seconds, page_count > 1),
        0
      ) as avg_visit_duration
    FROM session_data
    GROUP BY source_type, source_name, source_url
    ORDER BY visits DESC
    LIMIT {limit:UInt32}
  `;

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
        limit,
      },
    })
    .toPromise()) as any[];

  return result;
}

/**
 * Get top referrer URLs with visit counts
 */
export async function getTopReferrerUrls(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  queryFilters: QueryFilter[],
  limit: number = 10,
): Promise<TopReferrerUrl[]> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const query = safeSql`
    SELECT 
      referrer_url,
      uniq(session_id) as visits
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND referrer_url != ''
      AND referrer_source != 'direct'
      AND referrer_source != 'internal'
      AND ${SQL.AND(filters)}
    GROUP BY referrer_url
    ORDER BY visits DESC
    LIMIT {limit:UInt32}
  `;

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
        limit,
      },
    })
    .toPromise()) as any[];

  return TopReferrerUrlSchema.array().parse(result);
}

/**
 * Get top traffic channels (aggregated by referrer_source) with visit counts
 */
export async function getTopChannels(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  queryFilters: QueryFilter[],
  limit: number = 10,
): Promise<TopChannel[]> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const query = safeSql`
    SELECT 
      referrer_source as channel,
      uniq(session_id) as visits
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND referrer_source != 'internal'
      AND ${SQL.AND(filters)}
    GROUP BY channel
    ORDER BY visits DESC
    LIMIT {limit:UInt32}
  `;

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
        limit,
      },
    })
    .toPromise()) as any[];

  return TopChannelSchema.array().parse(result);
}

/**
 * Get top referrer sources with visit counts
 */
export async function getTopReferrerSources(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  queryFilters: QueryFilter[],
  limit: number = 10,
): Promise<TopReferrerSource[]> {
  const filters = BAQuery.getFilterQuery(queryFilters);

  const query = safeSql`
    SELECT 
      referrer_source,
      uniq(session_id) as visits
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND referrer_source != 'direct'
      AND referrer_source != 'internal'
      AND ${SQL.AND(filters)}
    GROUP BY referrer_source
    ORDER BY visits DESC
    LIMIT {limit:UInt32}
  `;

  const result = (await clickhouse
    .query(query.taggedSql, {
      params: {
        ...query.taggedParams,
        site_id: siteId,
        start: startDate,
        end: endDate,
        limit,
      },
    })
    .toPromise()) as any[];

  return TopReferrerSourceSchema.array().parse(result);
}
