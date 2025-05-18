'use server';

import { getPageAnalytics, getPageDetail } from "@/services/pages";
import { PageAnalytics } from "@/entities/pages";
import { checkAuth } from "@/lib/auth-actions";

export async function fetchPageAnalyticsAction(siteId: string, startDate: Date, endDate: Date): Promise<PageAnalytics[]> {
  await checkAuth();
  return getPageAnalytics(siteId, startDate, endDate);
}

export async function fetchPageDetailAction(siteId: string, path: string, startDate: Date, endDate: Date): Promise<PageAnalytics | null> {
  await checkAuth();
  return getPageDetail(siteId, path, startDate, endDate);
} 