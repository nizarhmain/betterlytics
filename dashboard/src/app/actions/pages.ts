'use server';

import {
  getPageAnalytics,
  getPageDetail,
  getPageTrafficForTimePeriod,
  getEntryPageAnalyticsForSite,
  getExitPageAnalyticsForSite,
  getPagesSummaryWithChartsForSite,
} from '@/services/pages';
import { PageAnalytics } from '@/entities/pages';
import { TotalPageViewsRow } from '@/entities/pageviews';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { QueryFilter } from '@/entities/filter';
import { withDashboardAuthContext } from '@/auth/auth-actions';
import { AuthContext } from '@/entities/authContext';

export const fetchPageAnalyticsAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    queryFilters: QueryFilter[],
  ): Promise<PageAnalytics[]> => {
    return getPageAnalytics(ctx.siteId, startDate, endDate, queryFilters);
  },
);

export const fetchPageDetailAction = withDashboardAuthContext(
  async (ctx: AuthContext, path: string, startDate: Date, endDate: Date): Promise<PageAnalytics | null> => {
    return getPageDetail(ctx.siteId, path, startDate, endDate);
  },
);

export const fetchEntryPageAnalyticsAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    queryFilters: QueryFilter[],
  ): Promise<PageAnalytics[]> => {
    return getEntryPageAnalyticsForSite(ctx.siteId, startDate, endDate, queryFilters);
  },
);

export const fetchExitPageAnalyticsAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    queryFilters: QueryFilter[],
  ): Promise<PageAnalytics[]> => {
    return getExitPageAnalyticsForSite(ctx.siteId, startDate, endDate, queryFilters);
  },
);

export const fetchPagesSummaryWithChartsAction = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]) => {
    return getPagesSummaryWithChartsForSite(ctx.siteId, startDate, endDate, queryFilters);
  },
);

export const fetchPageTrafficTimeSeriesAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    path: string,
    startDate: Date,
    endDate: Date,
    granularity: GranularityRangeValues,
  ): Promise<TotalPageViewsRow[]> => {
    return getPageTrafficForTimePeriod(ctx.siteId, path, startDate, endDate, granularity);
  },
);
