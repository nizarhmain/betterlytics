'server-only';

import {
  getDailyPageViews,
  getHourlyPageViews,
  getMinutePageViews,
  getDailyUniqueVisitors,
  getHourlyUniqueVisitors,
  getMinuteUniqueVisitors,
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