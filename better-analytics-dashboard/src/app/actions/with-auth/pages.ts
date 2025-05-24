'server only';

import { getPageAnalytics, getPageDetail, getPageTrafficForTimePeriod } from "@/services/pages";
import { PageAnalytics } from "@/entities/pages";
import { TotalPageViewsRow } from "@/entities/pageviews";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { QueryFilter } from "@/entities/filter";
import { AuthContext } from "@/entities/authContext";

export async function fetchPageAnalyticsAction(ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<PageAnalytics[]> {
  return getPageAnalytics(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchPageDetailAction(ctx: AuthContext, path: string, startDate: Date, endDate: Date): Promise<PageAnalytics | null> {
  return getPageDetail(ctx.siteId, path, startDate, endDate);
}

export async function fetchPageTrafficTimeSeriesAction(
  ctx: AuthContext,
  path: string,
  startDate: Date,
  endDate: Date,
  granularity: GranularityRangeValues
): Promise<TotalPageViewsRow[]> {
  return getPageTrafficForTimePeriod(ctx.siteId, path, startDate, endDate, granularity);
} 