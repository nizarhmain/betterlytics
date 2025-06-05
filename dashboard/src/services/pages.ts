'server-only';

import {
  getPageViews,
  getTopPages,
  getPageMetrics,
  getPageDetailMetrics,
  getTotalPageViews,
  getPageTrafficTimeSeries,
  getTopEntryPages,
  getTopExitPages,
  getEntryPageAnalytics as getEntryPageAnalyticsRepo,
  getExitPageAnalytics as getExitPageAnalyticsRepo,
} from '@/repositories/clickhouse';
import { DailyPageViewRow, TotalPageViewsRow } from '@/entities/pageviews';
import { toDateTimeString } from '@/utils/dateFormatters';
import { PageAnalytics, TopPageRow, TopEntryPageRow, TopExitPageRow } from '@/entities/pages';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { QueryFilter } from '@/entities/filter';

export async function getTotalPageViewsForSite(
  siteId: string,
  startDate: Date,
  endDate: Date,
  granularity: GranularityRangeValues,
  queryFilters: QueryFilter[],
): Promise<TotalPageViewsRow[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  return getTotalPageViews(siteId, formattedStart, formattedEnd, granularity, queryFilters);
}

export async function getPageViewsForSite(
  siteId: string,
  startDate: Date,
  endDate: Date,
  granularity: GranularityRangeValues,
): Promise<DailyPageViewRow[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  return getPageViews(siteId, formattedStart, formattedEnd, granularity);
}

export async function getTopPagesForSite(
  siteId: string,
  startDate: Date,
  endDate: Date,
  limit = 5,
  queryFilters: QueryFilter[] = [],
): Promise<TopPageRow[]> {
  return getTopPages(siteId, toDateTimeString(startDate), toDateTimeString(endDate), limit, queryFilters);
}

export async function getPageAnalytics(
  siteId: string,
  startDate: Date,
  endDate: Date,
  queryFilters: QueryFilter[],
): Promise<PageAnalytics[]> {
  return getPageMetrics(siteId, toDateTimeString(startDate), toDateTimeString(endDate), queryFilters);
}

export async function getPageDetail(
  siteId: string,
  path: string,
  startDate: Date,
  endDate: Date,
): Promise<PageAnalytics | null> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  return getPageDetailMetrics(siteId, path, formattedStart, formattedEnd);
}

export async function getPageTrafficForTimePeriod(
  siteId: string,
  path: string,
  startDate: Date,
  endDate: Date,
  granularity: GranularityRangeValues,
): Promise<TotalPageViewsRow[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  return getPageTrafficTimeSeries(siteId, path, formattedStart, formattedEnd, granularity);
}

export async function getTopEntryPagesForSite(
  siteId: string,
  startDate: Date,
  endDate: Date,
  limit = 5,
  queryFilters: QueryFilter[] = [],
): Promise<TopEntryPageRow[]> {
  return getTopEntryPages(siteId, toDateTimeString(startDate), toDateTimeString(endDate), limit, queryFilters);
}

export async function getTopExitPagesForSite(
  siteId: string,
  startDate: Date,
  endDate: Date,
  limit = 5,
  queryFilters: QueryFilter[] = [],
): Promise<TopExitPageRow[]> {
  return getTopExitPages(siteId, toDateTimeString(startDate), toDateTimeString(endDate), limit, queryFilters);
}

export async function getEntryPageAnalyticsForSite(
  siteId: string,
  startDate: Date,
  endDate: Date,
  queryFilters: QueryFilter[],
): Promise<PageAnalytics[]> {
  return getEntryPageAnalyticsRepo(
    siteId,
    toDateTimeString(startDate),
    toDateTimeString(endDate),
    100,
    queryFilters,
  );
}

export async function getExitPageAnalyticsForSite(
  siteId: string,
  startDate: Date,
  endDate: Date,
  queryFilters: QueryFilter[],
): Promise<PageAnalytics[]> {
  return getExitPageAnalyticsRepo(
    siteId,
    toDateTimeString(startDate),
    toDateTimeString(endDate),
    100,
    queryFilters,
  );
}

export async function getPagesSummaryWithChartsForSite(
  siteId: string,
  startDate: Date,
  endDate: Date,
  queryFilters: QueryFilter[],
) {
  const dailyGranularity: GranularityRangeValues = 'day';

  const [pageAnalytics, pageviewsChartData] = await Promise.all([
    getPageAnalytics(siteId, startDate, endDate, queryFilters),
    getTotalPageViewsForSite(siteId, startDate, endDate, dailyGranularity, queryFilters),
  ]);

  const totalPages = pageAnalytics.length;
  const totalPageviews = pageAnalytics.reduce((sum, page) => sum + page.pageviews, 0);
  const avgPageviews = totalPages > 0 ? Math.round(totalPageviews / totalPages) : 0;
  const avgTimeOnPage =
    totalPages > 0 ? pageAnalytics.reduce((sum, page) => sum + page.avgTime, 0) / totalPages : 0;
  const avgBounceRate =
    totalPages > 0 ? pageAnalytics.reduce((sum, page) => sum + page.bounceRate, 0) / totalPages : 0;

  const totalPagesChartData = pageviewsChartData.map((row) => ({
    date: row.date,
    value: totalPages,
  }));

  const avgTimeChartData = pageviewsChartData.map((row) => ({
    date: row.date,
    value: Math.round(avgTimeOnPage),
  }));

  const bounceRateChartData = pageviewsChartData.map((row) => ({
    date: row.date,
    value: Math.round(avgBounceRate),
  }));

  return {
    totalPages,
    avgPageviews,
    avgTimeOnPage: Math.round(avgTimeOnPage),
    avgBounceRate: Math.round(avgBounceRate),
    totalPagesChartData,
    avgTimeChartData,
    bounceRateChartData,
    pageviewsChartData,
  };
}
