'use server';

import { getReferrerSourceAggregationDataForSite } from '@/services/referrers';

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