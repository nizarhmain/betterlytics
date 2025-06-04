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
} from '@/repositories/clickhouse';
import { DailyPageViewRow, TotalPageViewsRow } from '@/entities/pageviews';
import { toDateTimeString } from '@/utils/dateFormatters';
import { PageAnalytics, TopPageRow, TopEntryPageRow, TopExitPageRow } from '@/entities/pages';
import { GranularityRangeValues } from '@/utils/granularityRanges';
import { QueryFilter } from '@/entities/filter';

export async function getTotalPageViewsForSite(siteId: string, startDate: Date, endDate: Date, granularity: GranularityRangeValues, queryFilters: QueryFilter[]): Promise<TotalPageViewsRow[]> {  
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  return getTotalPageViews(siteId, formattedStart, formattedEnd, granularity, queryFilters);
}

export async function getPageViewsForSite(siteId: string, startDate: Date, endDate: Date, granularity: GranularityRangeValues): Promise<DailyPageViewRow[]> {  
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  return getPageViews(siteId, formattedStart, formattedEnd, granularity);
}

export async function getTopPagesForSite(siteId: string, startDate: Date, endDate: Date, limit = 5, queryFilters: QueryFilter[] = []): Promise<TopPageRow[]> {
  return getTopPages(siteId, toDateTimeString(startDate), toDateTimeString(endDate), limit, queryFilters);
}

export async function getPageAnalytics(siteId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<PageAnalytics[]> {
  return getPageMetrics(siteId, toDateTimeString(startDate), toDateTimeString(endDate), queryFilters);
}

export async function getPageDetail(siteId: string, path: string, startDate: Date, endDate: Date): Promise<PageAnalytics | null> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  return getPageDetailMetrics(siteId, path, formattedStart, formattedEnd);
}

export async function getPageTrafficForTimePeriod(
  siteId: string, 
  path: string,
  startDate: Date, 
  endDate: Date, 
  granularity: GranularityRangeValues
): Promise<TotalPageViewsRow[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  return getPageTrafficTimeSeries(siteId, path, formattedStart, formattedEnd, granularity);
}

export async function getTopEntryPagesForSite(siteId: string, startDate: Date, endDate: Date, limit = 5, queryFilters: QueryFilter[] = []): Promise<TopEntryPageRow[]> {
  return getTopEntryPages(siteId, toDateTimeString(startDate), toDateTimeString(endDate), limit, queryFilters);
}

export async function getTopExitPagesForSite(siteId: string, startDate: Date, endDate: Date, limit = 5, queryFilters: QueryFilter[] = []): Promise<TopExitPageRow[]> {
  return getTopExitPages(siteId, toDateTimeString(startDate), toDateTimeString(endDate), limit, queryFilters);
}
