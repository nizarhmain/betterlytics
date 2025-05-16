'server-only';

import { getReferrerDistribution, getReferrerSummary, getReferrerTableData, getReferrerTrafficTrendBySource } from '@/repositories/clickhouse';
import { toDateTimeString } from '@/utils/dateFormatters';
import { ReferrerSourceAggregation, ReferrerSummary, ReferrerTableRow, ReferrerTableRowSchema, ReferrerTrafficBySourceRow } from '@/entities/referrers';
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

/**
 * Gets summary data about referrers for a given site and time period
 */
export async function getReferrerSummaryDataForSite(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<ReferrerSummary> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  const result = await getReferrerSummary(
    siteId, 
    formattedStart, 
    formattedEnd
  );
  
  return {
    ...result,
    avgBounceRate: Number(result.avgBounceRate.toFixed(1))
  };
}

/**
 * Gets detailed referrer data for table display
 */
export async function getReferrerTableDataForSite(
  siteId: string,
  startDate: string,
  endDate: string,
  limit = 100
): Promise<ReferrerTableRow[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  const result = await getReferrerTableData(
    siteId, 
    formattedStart, 
    formattedEnd, 
    limit
  );
  
  return result.map(row => ReferrerTableRowSchema.parse(row));
}