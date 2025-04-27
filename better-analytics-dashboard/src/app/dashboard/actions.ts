"use server";

import { getDailyPageViewsForSite } from '@/services/pageviews';
import { DailyPageViewRow } from '@/entities/pageviews';
import { getDailyUniqueVisitorsForSite } from '@/services/pageviews';
import { DailyUniqueVisitorsRow } from '@/entities/pageviews';

export async function fetchDailyPageViewsAction(siteId: string): Promise<DailyPageViewRow[]> {
  return getDailyPageViewsForSite(siteId);
}

export async function fetchDailyUniqueVisitorsAction(siteId: string): Promise<DailyUniqueVisitorsRow[]> {
  return getDailyUniqueVisitorsForSite(siteId);
} 