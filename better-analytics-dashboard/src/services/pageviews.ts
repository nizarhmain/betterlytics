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
  getSessionMetrics,
  getPageMetrics,
} from '@/repositories/clickhouse';
import { DailyPageViewRow } from '@/entities/pageviews';
import { toDateString, toDateTimeString, TimeGrouping } from '@/utils/timeRanges';
import { PageAnalytics } from '@/types/analytics';

export async function getPageViewsForSite(siteId: string, startDate: string, endDate: string, groupBy: TimeGrouping): Promise<DailyPageViewRow[]> {
  if (groupBy === 'day') return getDailyPageViews(siteId, toDateString(startDate), toDateString(endDate));
  if (groupBy === 'hour') return getHourlyPageViews(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
  return getMinutePageViews(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
}

export async function getUniqueVisitorsForSite(siteId: string, startDate: string, endDate: string, groupBy: TimeGrouping) {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  if (groupBy === 'day') {
    return getDailyUniqueVisitors(siteId, formattedStart, formattedEnd);
  }
  if (groupBy === 'hour') {
    return getHourlyUniqueVisitors(siteId, formattedStart, formattedEnd);
  }
  return getMinuteUniqueVisitors(siteId, formattedStart, formattedEnd);
}

export async function getSummaryStatsForSite(siteId: string, startDate: string, endDate: string) {
  const [uniqueVisitors, pageviews, sessionMetrics] = await Promise.all([
    getTotalUniqueVisitors(siteId, toDateTimeString(startDate), toDateTimeString(endDate)),
    getTotalPageviews(siteId, toDateTimeString(startDate), toDateTimeString(endDate)),
    getSessionMetrics(siteId, toDateTimeString(startDate), toDateTimeString(endDate))
  ]);

  return {
    uniqueVisitors,
    pageviews,
    bounceRate: sessionMetrics.total_sessions > 0 
      ? Math.round((sessionMetrics.total_sessions - sessionMetrics.multi_page_sessions) / sessionMetrics.total_sessions * 100)
      : 0,
    avgVisitDuration: sessionMetrics.multi_page_sessions > 0 
      ? Math.round(sessionMetrics.total_duration / sessionMetrics.multi_page_sessions)
      : 0
  };
}

export async function getTopPagesForSite(siteId: string, startDate: string, endDate: string, limit = 5) {
  return getTopPages(siteId, toDateTimeString(startDate), toDateTimeString(endDate), limit);
}

export async function getDeviceTypeBreakdownForSite(siteId: string, startDate: string, endDate: string) {
  return getDeviceTypeBreakdown(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
}

export async function getPageAnalytics(siteId: string, startDate: string, endDate: string): Promise<PageAnalytics[]> {
  return getPageMetrics(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
} 