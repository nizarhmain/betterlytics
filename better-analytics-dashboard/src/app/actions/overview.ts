'use server';

import { DailyUniqueVisitorsRow } from "@/entities/pageviews";
import { DailyPageViewRow } from "@/entities/pageviews";
import { getDeviceTypeBreakdownForSite } from "@/services/devices";
import { getPageViewsForSite, getTopPagesForSite } from "@/services/pages";
import { getSummaryStatsForSite } from "@/services/visitors";
import { getUniqueVisitorsForSite } from "@/services/visitors";
import { TimeGrouping } from "@/utils/timeRanges";

export async function fetchPageViewsAction(siteId: string, startDate: string, endDate: string, groupBy: TimeGrouping): Promise<DailyPageViewRow[]> {
  return getPageViewsForSite(siteId, startDate, endDate, groupBy);
}

export async function fetchUniqueVisitorsAction(siteId: string, startDate: string, endDate: string, groupBy: TimeGrouping): Promise<DailyUniqueVisitorsRow[]> {
  return getUniqueVisitorsForSite(siteId, startDate, endDate, groupBy);
}

export async function fetchSummaryStatsAction(siteId: string, startDate: string, endDate: string) {
  return getSummaryStatsForSite(siteId, startDate, endDate);
}

export async function fetchTopPagesAction(siteId: string, startDate: string, endDate: string, limit: number) {
  return getTopPagesForSite(siteId, startDate, endDate, limit);
}

export async function fetchDeviceTypeBreakdownAction(siteId: string, startDate: string, endDate: string) {
  return getDeviceTypeBreakdownForSite(siteId, startDate, endDate);
}
  
