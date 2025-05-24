'server only';

import { DailyUniqueVisitorsRow } from "@/entities/visitors";
import { DailyPageViewRow, TotalPageViewsRow } from "@/entities/pageviews";
import { getPageViewsForSite, getTopPagesForSite, getTotalPageViewsForSite } from "@/services/pages";
import { getSummaryStatsForSite } from "@/services/visitors";
import { getUniqueVisitorsForSite } from "@/services/visitors";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { QueryFilter } from "@/entities/filter";
import { AuthContext } from "@/entities/authContext";

export async function fetchTotalPageViewsAction(ctx: AuthContext, startDate: Date, endDate: Date, granularity: GranularityRangeValues, queryFilters: QueryFilter[]): Promise<TotalPageViewsRow[]> {
  return getTotalPageViewsForSite(ctx.siteId, startDate, endDate, granularity, queryFilters);
}

export async function fetchPageViewsAction(ctx: AuthContext, startDate: Date, endDate: Date, granularity: GranularityRangeValues): Promise<DailyPageViewRow[]> {
  return getPageViewsForSite(ctx.siteId, startDate, endDate, granularity);
}

export async function fetchUniqueVisitorsAction(ctx: AuthContext, startDate: Date, endDate: Date, granularity: GranularityRangeValues, queryFilters: QueryFilter[]): Promise<DailyUniqueVisitorsRow[]> {
  return getUniqueVisitorsForSite(ctx.siteId, startDate, endDate, granularity, queryFilters);
}

export async function fetchSummaryStatsAction(ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]) {
  return getSummaryStatsForSite(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchTopPagesAction(ctx: AuthContext, startDate: Date, endDate: Date, limit: number, queryFilters: QueryFilter[]) {
  return getTopPagesForSite(ctx.siteId, startDate, endDate, limit, queryFilters);
}
