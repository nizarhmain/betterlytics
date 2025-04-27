'server-only';

import { getDailyPageViews } from '@/repositories/clickhouse';
import { DailyPageViewRow } from '@/entities/pageviews';
import { getDailyUniqueVisitors } from '@/repositories/clickhouse';

export async function getDailyPageViewsForSite(siteId: string): Promise<DailyPageViewRow[]> {
  return getDailyPageViews(siteId);
}

export async function getDailyUniqueVisitorsForSite(siteId: string) {
  return getDailyUniqueVisitors(siteId);
} 