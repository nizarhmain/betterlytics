'use server';

import { DailyUniqueVisitorsRow } from "@/entities/visitors";
import { DailyPageViewRow, TotalPageViewsRow } from "@/entities/pageviews";
import { getDeviceTypeBreakdownForSite } from "@/services/devices";
import { getPageViewsForSite, getTopPagesForSite, getTotalPageViewsForSite } from "@/services/pages";
import { getSummaryStatsForSite } from "@/services/visitors";
import { getUniqueVisitorsForSite } from "@/services/visitors";
import { requireDashboardAuth } from "@/lib/auth-actions";
import { GranularityRangeValues } from "@/utils/granularityRanges";

export async function fetchTotalPageViewsAction(siteId: string, startDate: Date, endDate: Date, granularity: GranularityRangeValues): Promise<TotalPageViewsRow[]> {
  const session = await requireDashboardAuth();
  return getTotalPageViewsForSite(siteId, startDate, endDate, granularity);
}

export async function fetchPageViewsAction(siteId: string, startDate: Date, endDate: Date, granularity: GranularityRangeValues): Promise<DailyPageViewRow[]> {
  const session = await requireDashboardAuth();
  return getPageViewsForSite(siteId, startDate, endDate, granularity);
}

export async function fetchUniqueVisitorsAction(siteId: string, startDate: Date, endDate: Date, granularity: GranularityRangeValues): Promise<DailyUniqueVisitorsRow[]> {
  const session = await requireDashboardAuth();
  return getUniqueVisitorsForSite(siteId, startDate, endDate, granularity);
}

export async function fetchSummaryStatsAction(siteId: string, startDate: Date, endDate: Date) {
  const session = await requireDashboardAuth();
  return getSummaryStatsForSite(siteId, startDate, endDate);
}

export async function fetchTopPagesAction(siteId: string, startDate: Date, endDate: Date, limit: number) {
  const session = await requireDashboardAuth();
  return getTopPagesForSite(siteId, startDate, endDate, limit);
}

export async function fetchDeviceTypeBreakdownAction(siteId: string, startDate: Date, endDate: Date) {
  const session = await requireDashboardAuth();
  return getDeviceTypeBreakdownForSite(siteId, startDate, endDate);
}
  
