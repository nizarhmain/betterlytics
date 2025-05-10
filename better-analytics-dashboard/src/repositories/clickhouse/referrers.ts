import { ReferrerSourceAggregation, ReferrerSourceAggregationSchema, ReferrerSummary, ReferrerSummarySchema, ReferrerTrafficBySourceRow, ReferrerTrafficBySourceRowSchema } from '@/entities/referrers';
import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from '@/types/dates';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { BAQuery } from '@/lib/ba-query';

/**
 * Get the distribution of referrers by source type using unique sessions
 */
export async function getReferrerDistribution(
  siteId: string, 
  startDate: DateTimeString, 
  endDate: DateTimeString
): Promise<ReferrerSourceAggregation[]> {
  const query = `
    SELECT 
      referrer_source,
      uniq(session_id) as visitorCount
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
    GROUP BY referrer_source
    ORDER BY visitorCount DESC
  `;

  const result = await clickhouse.query(query, {
    params: { 
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
  
  const query = `
    SELECT 
      ${granularityFunc}(timestamp) as date,
      referrer_source,
      uniq(session_id) as count
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
    GROUP BY date, referrer_source
    ORDER BY date ASC
  `;

  const result = await clickhouse.query(query, {
    params: {
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
  const query = `
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
      uniq(session_id) as referralTraffic,
      (
        SELECT count()
        FROM session_view_counts
        WHERE page_views = 1 
          AND session_id IN (
            SELECT DISTINCT session_id
            FROM analytics.events
            WHERE site_id = {site_id:String}
              AND timestamp >= {start:DateTime}
              AND timestamp <= {end:DateTime}
              AND referrer_source != 'direct'
          )
      ) / uniq(session_id) * 100 as avgBounceRate
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
      AND referrer_source != 'direct'
  `;

  const result = await clickhouse.query(query, {
    params: { 
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