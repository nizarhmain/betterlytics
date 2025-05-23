'use server';

import { DailyUniqueVisitorsRow } from "@/entities/visitors";
import { DailyPageViewRow, TotalPageViewsRow } from "@/entities/pageviews";
import { getDeviceTypeBreakdownForSite } from "@/services/devices";
import { getPageViewsForSite, getTopPagesForSite, getTotalPageViewsForSite } from "@/services/pages";
import { getSummaryStatsForSite } from "@/services/visitors";
import { getUniqueVisitorsForSite } from "@/services/visitors";
import { requireDashboardAuth } from "@/lib/auth-actions";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { QueryFilter } from "@/entities/filter";

export async function fetchTotalPageViewsAction(siteId: string, startDate: Date, endDate: Date, granularity: GranularityRangeValues, queryFilters: QueryFilter[]): Promise<TotalPageViewsRow[]> {
  await requireDashboardAuth();
  return getTotalPageViewsForSite(siteId, startDate, endDate, granularity, queryFilters);
}

export async function fetchPageViewsAction(siteId: string, startDate: Date, endDate: Date, granularity: GranularityRangeValues): Promise<DailyPageViewRow[]> {
  await requireDashboardAuth();
  return getPageViewsForSite(siteId, startDate, endDate, granularity);
}

export async function fetchUniqueVisitorsAction(siteId: string, startDate: Date, endDate: Date, granularity: GranularityRangeValues, queryFilters: QueryFilter[]): Promise<DailyUniqueVisitorsRow[]> {
  await requireDashboardAuth();
  return getUniqueVisitorsForSite(siteId, startDate, endDate, granularity, queryFilters);
}

export async function fetchSummaryStatsAction(siteId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]) {
  await requireDashboardAuth();
  return getSummaryStatsForSite(siteId, startDate, endDate, queryFilters);
}

export async function fetchTopPagesAction(siteId: string, startDate: Date, endDate: Date, limit: number, queryFilters: QueryFilter[]) {
  await requireDashboardAuth();
  return getTopPagesForSite(siteId, startDate, endDate, limit, queryFilters);
}

export async function fetchDeviceTypeBreakdownAction(siteId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]) {
  await requireDashboardAuth();
  return getDeviceTypeBreakdownForSite(siteId, startDate, endDate, queryFilters);
}
  
