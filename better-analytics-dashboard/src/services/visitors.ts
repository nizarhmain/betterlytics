'server-only';

import {
  getDailyUniqueVisitors,
  getHourlyUniqueVisitors,
  getMinuteUniqueVisitors,
  getTotalUniqueVisitors,
  getTotalPageviews,
  getSessionMetrics
} from '@/repositories/clickhouse';
import { toDateTimeString, toDateString } from '@/utils/dateFormatters';
import { TimeGrouping } from '@/utils/timeRanges';

export async function getUniqueVisitorsForSite(siteId: string, startDate: string, endDate: string, groupBy: TimeGrouping) {
  if (groupBy === 'day') {
    return getDailyUniqueVisitors(siteId, toDateString(startDate), toDateString(endDate));
  }
  
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  if (groupBy === 'hour') {
    return getHourlyUniqueVisitors(siteId, formattedStart, formattedEnd);
  }
  return getMinuteUniqueVisitors(siteId, formattedStart, formattedEnd);
}

export async function getSummaryStatsForSite(siteId: string, startDate: string, endDate: string) {
  const [uniqueVisitors, pageviews, sessionMetrics] = await Promise.all([
    getTotalUniqueVisitors(siteId, toDateString(startDate), toDateString(endDate)),
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
