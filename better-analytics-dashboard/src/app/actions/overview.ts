'use server';

import { DailyUniqueVisitorsRow } from "@/entities/visitors";
import { DailyPageViewRow, TotalPageViewsRow } from "@/entities/pageviews";
import { getPageViewsForSite, getTopPagesForSite, getTotalPageViewsForSite } from "@/services/pages";
import { getSummaryStatsForSite } from "@/services/visitors";
import { getUniqueVisitorsForSite } from "@/services/visitors";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { QueryFilter } from "@/entities/filter";
import { usingAuthContext } from "./using-context-auth";

export async function fetchTotalPageViewsAction(dashboardId: string, startDate: Date, endDate: Date, granularity: GranularityRangeValues, queryFilters: QueryFilter[]): Promise<TotalPageViewsRow[]> {
  const ctx = await usingAuthContext(dashboardId);
  return getTotalPageViewsForSite(ctx.siteId, startDate, endDate, granularity, queryFilters);
}

export async function fetchPageViewsAction(dashboardId: string, startDate: Date, endDate: Date, granularity: GranularityRangeValues): Promise<DailyPageViewRow[]> {
  const ctx = await usingAuthContext(dashboardId);
  return getPageViewsForSite(ctx.siteId, startDate, endDate, granularity);
}

export async function fetchUniqueVisitorsAction(dashboardId: string, startDate: Date, endDate: Date, granularity: GranularityRangeValues, queryFilters: QueryFilter[]): Promise<DailyUniqueVisitorsRow[]> {
  const ctx = await usingAuthContext(dashboardId);
  return getUniqueVisitorsForSite(ctx.siteId, startDate, endDate, granularity, queryFilters);
}

export async function fetchSummaryStatsAction(dashboardId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]) {
  const ctx = await usingAuthContext(dashboardId);
  return getSummaryStatsForSite(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchTopPagesAction(dashboardId: string, startDate: Date, endDate: Date, limit: number, queryFilters: QueryFilter[]) {
  const ctx = await usingAuthContext(dashboardId);
  return getTopPagesForSite(ctx.siteId, startDate, endDate, limit, queryFilters);
}
