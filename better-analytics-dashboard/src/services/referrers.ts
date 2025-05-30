'server-only';

import { getReferrerDistribution, getReferrerSummary, getReferrerTableData, getReferrerTrafficTrendBySource, getTopReferrerUrls, getTopChannels, getTopReferrerSources } from '@/repositories/clickhouse';
import { toDateTimeString } from '@/utils/dateFormatters';
import { ReferrerSourceAggregation, ReferrerSummary, ReferrerTableRow, ReferrerTableRowSchema, ReferrerTrafficBySourceRow, TopReferrerUrl, TopChannel, TopReferrerSource } from '@/entities/referrers';
import { GranularityRangeValues } from '@/utils/granularityRanges';

/**
 * Gets the aggregated referrers by source for a given site and time period
 */
export async function getReferrerSourceAggregationDataForSite(
  siteId: string, 
  startDate: Date,
  endDate: Date
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
  startDate: Date,
  endDate: Date,
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
  startDate: Date,
  endDate: Date
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
  startDate: Date,
  endDate: Date,
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

/**
 * Gets top referrer URLs
 */
export async function getTopReferrerUrlsForSite(
  siteId: string,
  startDate: Date,
  endDate: Date,
  limit = 10
): Promise<TopReferrerUrl[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  return getTopReferrerUrls(siteId, formattedStart, formattedEnd, limit);
}

/**
 * Gets top traffic channels
 */
export async function getTopChannelsForSite(
  siteId: string,
  startDate: Date,
  endDate: Date,
  limit = 10
): Promise<TopChannel[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  return getTopChannels(siteId, formattedStart, formattedEnd, limit);
}

/**
 * Gets top referrer sources with visit counts
 */
export async function getTopReferrerSourcesForSite(
  siteId: string,
  startDate: Date,
  endDate: Date,
  limit = 10
): Promise<TopReferrerSource[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  return getTopReferrerSources(siteId, formattedStart, formattedEnd, limit);
}