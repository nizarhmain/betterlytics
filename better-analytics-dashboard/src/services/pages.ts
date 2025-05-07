'server-only';

import {
  getPageViews,
  getTopPages,
  getPageMetrics,
} from '@/repositories/clickhouse';
import { DailyPageViewRow } from '@/entities/pageviews';
import { toDateTimeString } from '@/utils/dateFormatters';
import { PageAnalytics } from '@/entities/pages';
import { GranularityRangeValues } from '@/utils/granularityRanges';

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
