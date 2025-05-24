'server only';

import { getReferrerSourceAggregationDataForSite, getReferrerSummaryDataForSite, getReferrerTableDataForSite, getReferrerTrafficTrendBySourceDataForSite } from '@/services/referrers';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { AuthContext } from '@/entities/authContext';

/**
 * Fetches the referrer distribution data for a site
 */
export async function fetchReferrerSourceAggregationDataForSite(ctx: AuthContext, startDate: Date, endDate: Date) {
  try {
    const data = await getReferrerSourceAggregationDataForSite(ctx.siteId, startDate, endDate);
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
  ctx: AuthContext, 
  startDate: Date, 
  endDate: Date,
  granularity: GranularityRangeValues
) {
  try {
    const data = await getReferrerTrafficTrendBySourceDataForSite(ctx.siteId, startDate, endDate, granularity);
    return { data };
  } catch (error) {
    console.error('Error fetching referrer traffic trend by source:', error);
    throw error;
  }
} 

/**
 * Fetches the summary data for referrers including total count, traffic and bounce rate
 */
export async function fetchReferrerSummaryDataForSite(ctx: AuthContext, startDate: Date, endDate: Date) {
  try {
    const data = await getReferrerSummaryDataForSite(ctx.siteId, startDate, endDate);
    return { data };
  } catch (error) {
    console.error('Error fetching referrer summary data:', error);
    throw error;
  }
} 

/**
 * Fetches detailed referrer data for table display
 */
export async function fetchReferrerTableDataForSite(ctx: AuthContext, startDate: Date, endDate: Date, limit = 100) {  
  try {
    const data = await getReferrerTableDataForSite(ctx.siteId, startDate, endDate, limit);
    return { data };
  } catch (error) {
    console.error('Error fetching referrer table data:', error);
    throw error;
  }
} 
