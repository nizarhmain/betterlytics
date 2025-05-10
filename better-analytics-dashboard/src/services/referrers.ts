'server-only';

import { getReferrerDistribution, getReferrerTrafficTrendBySource } from '@/repositories/clickhouse';
import { toDateTimeString } from '@/utils/dateFormatters';
import { ReferrerSourceAggregation, ReferrerTrafficBySourceRow } from '@/entities/referrers';
import { GranularityRangeValues } from '@/utils/granularityRanges';

/**
 * Gets the aggregated referrers by source for a given site and time period
 */
export async function getReferrerSourceAggregationDataForSite(
  siteId: string, 
  startDate: string, 
  endDate: string
): Promise<ReferrerSourceAggregation[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  return getReferrerDistribution(siteId, formattedStart, formattedEnd);
}

/**
 * Gets the referrer traffic trend data grouped by source for a given site and time period
 */
export async function getReferrerTrafficTrendBySourceDataForSite(
  siteId: string,
  startDate: string,
  endDate: string,
  granularity: GranularityRangeValues
): Promise<ReferrerTrafficBySourceRow[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  return getReferrerTrafficTrendBySource(siteId, formattedStart, formattedEnd, granularity);
}