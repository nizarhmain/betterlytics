"use server";

import { getPageViewsForSite, getUniqueVisitorsForSite, getSummaryStatsForSite, getTopPagesForSite, getDeviceTypeBreakdownForSite } from '@/services/pageviews';
import { DailyPageViewRow, DailyUniqueVisitorsRow } from '@/entities/pageviews';
import { TimeGrouping } from '@/utils/timeRanges';

export async function fetchPageViewsAction(siteId: string, startDate: string, endDate: string, groupBy: TimeGrouping): Promise<DailyPageViewRow[]> {
  return getPageViewsForSite(siteId, startDate, endDate, groupBy);
}

export async function fetchUniqueVisitorsAction(siteId: string, startDate: string, endDate: string, groupBy: TimeGrouping): Promise<DailyUniqueVisitorsRow[]> {
  return getUniqueVisitorsForSite(siteId, startDate, endDate, groupBy);
}

export async function fetchSummaryStatsAction(siteId: string, startDate: string, endDate: string) {
  return getSummaryStatsForSite(siteId, startDate, endDate);
}

export async function fetchTopPagesAction(siteId: string, startDate: string, endDate: string, limit = 5) {
  return getTopPagesForSite(siteId, startDate, endDate, limit);
}

export async function fetchDeviceTypeBreakdownAction(siteId: string, startDate: string, endDate: string) {
  return getDeviceTypeBreakdownForSite(siteId, startDate, endDate);
} 