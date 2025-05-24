'use server';

import { getPageAnalytics, getPageDetail, getPageTrafficForTimePeriod } from "@/services/pages";
import { PageAnalytics } from "@/entities/pages";
import { TotalPageViewsRow } from "@/entities/pageviews";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { QueryFilter } from "@/entities/filter";
import { usingAuthContext } from "./using-context-auth";

export async function fetchPageAnalyticsAction(dashboardId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<PageAnalytics[]> {
  const ctx = await usingAuthContext(dashboardId);
  return getPageAnalytics(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchPageDetailAction(dashboardId: string, path: string, startDate: Date, endDate: Date): Promise<PageAnalytics | null> {
  const ctx = await usingAuthContext(dashboardId);
  return getPageDetail(ctx.siteId, path, startDate, endDate);
}

export async function fetchPageTrafficTimeSeriesAction(
  dashboardId: string,
  path: string,
  startDate: Date,
  endDate: Date,
  granularity: GranularityRangeValues
): Promise<TotalPageViewsRow[]> {
  const ctx = await usingAuthContext(dashboardId);
  return getPageTrafficForTimePeriod(ctx.siteId, path, startDate, endDate, granularity);
} 