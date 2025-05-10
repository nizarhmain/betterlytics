import { ReferrerSourceAggregation, ReferrerSourceAggregationSchema, ReferrerTrafficBySourceRow, ReferrerTrafficBySourceRowSchema } from '@/entities/referrers';
import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from '@/types/dates';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { BAQuery } from '@/lib/ba-query';

/**
 * Get the distribution of referrers by source type
 */
export async function getReferrerDistribution(
  siteId: string, 
  startDate: DateTimeString, 
  endDate: DateTimeString
): Promise<ReferrerSourceAggregation[]> {
  const query = `
    SELECT 
      referrer_source,
      count() as visitorCount
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
      count() as count
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