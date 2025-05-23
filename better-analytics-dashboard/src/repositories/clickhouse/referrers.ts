import { ReferrerSourceAggregation, ReferrerSourceAggregationSchema, ReferrerSummary, ReferrerSummarySchema, ReferrerTrafficBySourceRow, ReferrerTrafficBySourceRowSchema } from '@/entities/referrers';
import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from '@/types/dates';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { BAQuery } from '@/lib/ba-query';
import { safeSql } from '@/lib/safe-sql';

/**
 * Get the distribution of referrers by source type using unique sessions
 */
export async function getReferrerDistribution(
  siteId: string, 
  startDate: DateTimeString, 
  endDate: DateTimeString
): Promise<ReferrerSourceAggregation[]> {
  const query = safeSql`
    SELECT 
      referrer_source,
      uniq(session_id) as visitorCount
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
      AND referrer_source != 'internal'
    GROUP BY referrer_source
    ORDER BY visitorCount DESC
  `;

  const result = await clickhouse.query(query.taggedSql, {
    params: {
      ...query.taggedParams,
      site_id: siteId, 
      start: startDate, 
      end: endDate 
    },
  }).toPromise() as any[];
  
  return ReferrerSourceAggregationSchema.array().parse(result);
}

/**
 * Get the traffic trend for referrers grouped by source with specified granularity
 */
export async function getReferrerTrafficTrendBySource(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  granularity: GranularityRangeValues
): Promise<ReferrerTrafficBySourceRow[]> {
  const granularityFunc = BAQuery.getGranularitySQLFunctionFromGranularityRange(granularity);
  
  const query = safeSql`
    SELECT 
      ${granularityFunc}(timestamp) as date,
      referrer_source,
      count() as count
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND referrer_source != 'internal'
    GROUP BY date, referrer_source
    ORDER BY date ASC
  `;

  const result = await clickhouse.query(query.taggedSql, {
    params: {
      ...query.taggedParams,
      site_id: siteId,
      start: startDate,
      end: endDate
    },
  }).toPromise() as any[];

  return result.map(row => ReferrerTrafficBySourceRowSchema.parse(row));
}

/**
 * Get summary data about referrers including total count, traffic, and bounce rate
 * 
 * The query is a bit complex so here's a breakdown:
 * 1. Pre-calculate session counts once
 * 2. Calculate total referrers by counting distinct referrer sources
 * 3. Calculate referral traffic by counting unique sessions from referrers
 * 4. Calculate bounce rate by counting sessions with exactly one page view
 */
export async function getReferrerSummary(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString
): Promise<ReferrerSummary> {
  const query = safeSql`
    WITH session_view_counts AS (
      SELECT 
        session_id, 
        count() as page_views
      FROM analytics.events
      WHERE site_id = {site_id:String}
        AND timestamp >= {start:DateTime}
        AND timestamp <= {end:DateTime}
      GROUP BY session_id
    )
    
    SELECT
      count(DISTINCT referrer_source) as totalReferrers,
      count() as referralTraffic,
      (
        SELECT count()
        FROM session_view_counts
        WHERE page_views = 1 
          AND session_id IN (
            SELECT DISTINCT session_id
            FROM analytics.events
            WHERE site_id = {site_id:String}
              AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
              AND referrer_source != 'direct'
              AND referrer_source != 'internal'
          )
      ) / uniq(session_id) * 100 as avgBounceRate
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND referrer_source != 'direct'
      AND referrer_source != 'internal'
  `;

  const result = await clickhouse.query(query.taggedSql, {
    params: {
      ...query.taggedParams,
      site_id: siteId, 
      start: startDate, 
      end: endDate 
    },
  }).toPromise() as any[];
  
  const summary = {
    totalReferrers: Number(result[0]?.totalReferrers) || 0,
    referralTraffic: Number(result[0]?.referralTraffic) || 0,
    avgBounceRate: Number(result[0]?.avgBounceRate) || 0
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
  limit = 100
): Promise<any[]> {
  const query = safeSql`
    WITH 
      -- Calculate sessions with a single page view (bounces)
      session_pages AS (
        SELECT 
          session_id,
          count() as page_count
        FROM analytics.events
        WHERE site_id = {site_id:String}
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
        GROUP BY session_id
      ),
      
      -- Calculate visit durations
      visit_durations AS (
        SELECT
          referrer_source,
          session_id,
          max(timestamp) - min(timestamp) as duration_seconds
        FROM analytics.events
        WHERE site_id = {site_id:String}
          AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
        GROUP BY referrer_source, session_id
      )

    SELECT
      r.referrer_source as source_type,
      r.referrer_source_name as source_name,
      r.referrer_url as source_url,
      count() as visits,
      -- Calculate bounce rate for this referrer
      round(
        countIf(sp.page_count = 1) / uniq(r.session_id) * 100,
        1
      ) as bounce_rate,
      -- Calculate average visit duration
      round(
        avg(vd.duration_seconds),
        1
      ) as avg_visit_duration
    FROM analytics.events as r
    LEFT JOIN session_pages as sp ON r.session_id = sp.session_id
    LEFT JOIN visit_durations as vd ON r.session_id = vd.session_id
    WHERE r.site_id = {site_id:String}
      AND r.timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND r.referrer_source != 'internal'
    GROUP BY r.referrer_source, r.referrer_source_name, r.referrer_url
    ORDER BY visits DESC
    LIMIT {limit:UInt32}
  `;

  const result = await clickhouse.query(query.taggedSql, {
    params: {
      ...query.taggedParams,
      site_id: siteId, 
      start: startDate, 
      end: endDate,
      limit: limit
    },
    format: 'JSONEachRow'
  }).toPromise() as any[];
  
  return result;
} 