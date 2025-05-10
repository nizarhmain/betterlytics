'use server';

import { getReferrerSourceAggregationDataForSite, getReferrerTrafficTrendBySourceDataForSite } from '@/services/referrers';
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