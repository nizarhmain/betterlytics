"use server";

import { getDailyPageViewsForSite } from '@/services/pageviews';
import { DailyPageViewRow } from '@/entities/pageviews';

export async function fetchDailyPageViewsAction(siteId: string): Promise<DailyPageViewRow[]> {
  return getDailyPageViewsForSite(siteId);
} 