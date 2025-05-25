"use server";

import {
  getPageAnalytics,
  getPageDetail,
  getPageTrafficForTimePeriod,
} from "@/services/pages";
import { PageAnalytics } from "@/entities/pages";
import { TotalPageViewsRow } from "@/entities/pageviews";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { QueryFilter } from "@/entities/filter";
import { withDashboardAuthContext } from "@/auth/auth-actions";
import { AuthContext } from "@/entities/authContext";

export const fetchPageAnalyticsAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    queryFilters: QueryFilter[]
  ): Promise<PageAnalytics[]> => {
    return getPageAnalytics(ctx.siteId, startDate, endDate, queryFilters);
  }
);

export const fetchPageDetailAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    path: string,
    startDate: Date,
    endDate: Date
  ): Promise<PageAnalytics | null> => {
    return getPageDetail(ctx.siteId, path, startDate, endDate);
  }
);

export const fetchPageTrafficTimeSeriesAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    path: string,
    startDate: Date,
    endDate: Date,
    granularity: GranularityRangeValues
  ): Promise<TotalPageViewsRow[]> => {
    return getPageTrafficForTimePeriod(
      ctx.siteId,
      path,
      startDate,
      endDate,
      granularity
    );
  }
);
