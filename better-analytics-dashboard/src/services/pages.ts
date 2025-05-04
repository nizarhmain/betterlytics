'server-only';

import {
  getDailyPageViews,
  getHourlyPageViews,
  getMinutePageViews,
  getTopPages,
  getPageMetrics,
  getTotalPageviews
} from '@/repositories/clickhouse';
import { DailyPageViewRow } from '@/entities/pageviews';
import { toDateString, toDateTimeString } from '@/utils/dateFormatters';
import { TimeGrouping } from '@/utils/timeRanges';
import { PageAnalytics } from '@/types/analytics';

export async function getPageViewsForSite(siteId: string, startDate: string, endDate: string, groupBy: TimeGrouping): Promise<DailyPageViewRow[]> {
  if (groupBy === 'day') return getDailyPageViews(siteId, toDateString(startDate), toDateString(endDate));
  if (groupBy === 'hour') return getHourlyPageViews(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
  return getMinutePageViews(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
}

export async function getTopPagesForSite(siteId: string, startDate: string, endDate: string, limit = 5) {
  return getTopPages(siteId, toDateTimeString(startDate), toDateTimeString(endDate), limit);
}

export async function getPageAnalytics(siteId: string, startDate: string, endDate: string): Promise<PageAnalytics[]> {
  return getPageMetrics(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
}
