'server-only';

import { getDailyPageViews } from '@/repositories/clickhouse';
import { DailyPageViewRow } from '@/entities/pageviews';

export async function getDailyPageViewsForSite(siteId: string): Promise<DailyPageViewRow[]> {
  return getDailyPageViews(siteId);
} 