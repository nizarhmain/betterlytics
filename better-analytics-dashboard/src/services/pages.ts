'server-only';

import {
  getPageViews,
  getTopPages,
  getPageMetrics,
  getTotalPageViews,
} from '@/repositories/clickhouse';
import { DailyPageViewRow, TotalPageViewsRow } from '@/entities/pageviews';
import { toDateTimeString } from '@/utils/dateFormatters';
import { PageAnalytics } from '@/entities/pages';
import { GranularityRangeValues } from '@/utils/granularityRanges';

export async function getTotalPageViewsForSite(siteId: string, startDate: string, endDate: string, granularity: GranularityRangeValues): Promise<TotalPageViewsRow[]> {  
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  return getTotalPageViews(siteId, formattedStart, formattedEnd, granularity);
}

export async function getPageViewsForSite(siteId: string, startDate: string, endDate: string, granularity: GranularityRangeValues): Promise<DailyPageViewRow[]> {  
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  return getPageViews(siteId, formattedStart, formattedEnd, granularity);
}

export async function getTopPagesForSite(siteId: string, startDate: string, endDate: string, limit = 5) {
  return getTopPages(siteId, toDateTimeString(startDate), toDateTimeString(endDate), limit);
}

export async function getPageAnalytics(siteId: string, startDate: string, endDate: string): Promise<PageAnalytics[]> {
  return getPageMetrics(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
}
