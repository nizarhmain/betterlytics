'use server';

import { getReferrerSourceAggregationDataForSite, getReferrerSummaryDataForSite, getReferrerTrafficTrendBySourceDataForSite } from '@/services/referrers';
import { GranularityRangeValues } from '@/utils/granularityRanges';

/**
 * Fetches the referrer distribution data for a site
 */
export async function fetchReferrerSourceAggregationDataForSite(siteId: string, startDate: string, endDate: string) {
  try {
    const data = await getReferrerSourceAggregationDataForSite(siteId, startDate, endDate);
    return { data };
  } catch (error) {
    console.error('Error fetching referrer distribution:', error);
    throw error;
  }
} 

/**
 * Fetches the referrer traffic trend data grouped by source type for a site with specified granularity
 */
export async function fetchReferrerTrafficTrendBySourceDataForSite(
  siteId: string, 
  startDate: string, 
  endDate: string,
  granularity: GranularityRangeValues
) {
  try {
    const data = await getReferrerTrafficTrendBySourceDataForSite(siteId, startDate, endDate, granularity);
    return { data };
  } catch (error) {
    console.error('Error fetching referrer traffic trend by source:', error);
    throw error;
  }
} 

/**
 * Fetches the summary data for referrers including total count, traffic and bounce rate
 */
export async function fetchReferrerSummaryDataForSite(siteId: string, startDate: string, endDate: string) {
  try {
    const data = await getReferrerSummaryDataForSite(siteId, startDate, endDate);
    return { data };
  } catch (error) {
    console.error('Error fetching referrer summary data:', error);
    throw error;
  }
} 