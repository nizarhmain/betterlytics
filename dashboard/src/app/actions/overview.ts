'use server';

import { DailySessionMetricsRow } from '@/entities/sessionMetrics';
import {
  TopPageRow,
  TopEntryPageRow,
  TopExitPageRow,
  PageAnalyticsCombined,
  PageAnalyticsCombinedSchema,
} from '@/entities/pages';
import {
  getTopPagesForSite,
  getTotalPageViewsForSite,
  getTopEntryPagesForSite,
  getTopExitPagesForSite,
} from '@/services/pages';
import { getSummaryStatsWithChartsForSite } from '@/services/visitors';
import { getUniqueVisitorsForSite } from '@/services/visitors';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { QueryFilter } from '@/entities/filter';
import { withDashboardAuthContext } from '@/auth/auth-actions';
import { AuthContext } from '@/entities/authContext';
import { getSessionMetrics } from '@/repositories/clickhouse';
import { toDateTimeString } from '@/utils/dateFormatters';
import { toAreaChart } from '@/presenters/toAreaChart';

export const fetchTotalPageViewsAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    granularity: GranularityRangeValues,
    queryFilters: QueryFilter[],
    compareStartDate?: Date,
    compareEndDate?: Date,
  ) => {
    const data = await getTotalPageViewsForSite(ctx.siteId, startDate, endDate, granularity, queryFilters);
    const compare =
      compareStartDate && compareEndDate
        ? await getTotalPageViewsForSite(ctx.siteId, startDate, endDate, granularity, queryFilters)
        : undefined;

    console.log(data, compare);
    return toAreaChart({
      data,
      compare,
      granularity,
      dataKey: 'views',
    });
  },
);

export const fetchUniqueVisitorsAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    granularity: GranularityRangeValues,
    queryFilters: QueryFilter[],
  ) => {
    const data = await getUniqueVisitorsForSite(ctx.siteId, startDate, endDate, granularity, queryFilters);
    return toAreaChart({
      data,
      granularity,
      dataKey: 'unique_visitors',
    });
  },
);

// Enhanced summary stats action that includes chart data
export const fetchSummaryStatsAction = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]) => {
    return getSummaryStatsWithChartsForSite(ctx.siteId, startDate, endDate, queryFilters);
  },
);

export const fetchSessionMetricsAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    granularity: GranularityRangeValues,
    queryFilters: QueryFilter[],
  ) => {
    const data = await getSessionMetrics(
      ctx.siteId,
      toDateTimeString(startDate),
      toDateTimeString(endDate),
      granularity,
      queryFilters,
    );

    return {
      avgVisitDuration: toAreaChart({ data, granularity, dataKey: 'avg_visit_duration' }),
      bounceRate: toAreaChart({ data, granularity, dataKey: 'bounce_rate' }),
    };
  },
);

export const fetchTopEntryPagesAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    limit: number,
    queryFilters: QueryFilter[],
  ): Promise<TopEntryPageRow[]> => {
    return getTopEntryPagesForSite(ctx.siteId, startDate, endDate, limit, queryFilters);
  },
);

export const fetchTopExitPagesAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    limit: number,
    queryFilters: QueryFilter[],
  ): Promise<TopExitPageRow[]> => {
    return getTopExitPagesForSite(ctx.siteId, startDate, endDate, limit, queryFilters);
  },
);

export const fetchPageAnalyticsCombinedAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    limit: number = 5,
    queryFilters: QueryFilter[],
  ): Promise<PageAnalyticsCombined> => {
    const [topPages, topEntryPages, topExitPages] = await Promise.all([
      getTopPagesForSite(ctx.siteId, startDate, endDate, limit, queryFilters),
      getTopEntryPagesForSite(ctx.siteId, startDate, endDate, limit, queryFilters),
      getTopExitPagesForSite(ctx.siteId, startDate, endDate, limit, queryFilters),
    ]);

    return PageAnalyticsCombinedSchema.parse({
      topPages,
      topEntryPages,
      topExitPages,
    });
  },
);
