'server-only';

import {
  getDailyPageViews,
  getHourlyPageViews,
  getMinutePageViews,
  getDailyUniqueVisitors,
  getHourlyUniqueVisitors,
  getMinuteUniqueVisitors,
  getTotalUniqueVisitors,
  getTotalPageviews,
  getTopPages,
  getDeviceTypeBreakdown,
} from '@/repositories/clickhouse';
import { DailyPageViewRow } from '@/entities/pageviews';
import { toDateString, toDateTimeString, TimeGrouping } from '@/utils/timeRanges';

export async function getPageViewsForSite(siteId: string, startDate: string, endDate: string, groupBy: TimeGrouping): Promise<DailyPageViewRow[]> {
  if (groupBy === 'day') return getDailyPageViews(siteId, toDateString(startDate), toDateString(endDate));
  if (groupBy === 'hour') return getHourlyPageViews(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
  return getMinutePageViews(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
}

export async function getUniqueVisitorsForSite(siteId: string, startDate: string, endDate: string, groupBy: TimeGrouping) {
  if (groupBy === 'day') return getDailyUniqueVisitors(siteId, toDateString(startDate), toDateString(endDate));
  if (groupBy === 'hour') return getHourlyUniqueVisitors(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
  return getMinuteUniqueVisitors(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
}

export async function getSummaryStatsForSite(siteId: string, startDate: string, endDate: string) {
  const [uniqueVisitors, pageviews] = await Promise.all([
    getTotalUniqueVisitors(siteId, toDateTimeString(startDate), toDateTimeString(endDate)),
    getTotalPageviews(siteId, toDateTimeString(startDate), toDateTimeString(endDate)),
  ]);

  return {
    uniqueVisitors,
    pageviews,
    bounceRate: 0, // TODO: Implement bounce rate
    avgVisitDuration: 0, // TODO: Implement avg visit duration
  };
}

export async function getTopPagesForSite(siteId: string, startDate: string, endDate: string, limit = 5) {
  return getTopPages(siteId, toDateTimeString(startDate), toDateTimeString(endDate), limit);
}

export async function getDeviceTypeBreakdownForSite(siteId: string, startDate: string, endDate: string) {
  return getDeviceTypeBreakdown(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
} 