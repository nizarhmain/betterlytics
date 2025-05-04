'use server';

import { getPageAnalytics } from "@/services/pages";
import { PageAnalytics } from "@/types/analytics";
import { checkAuth } from "@/lib/auth-actions";

export async function fetchPageAnalyticsAction(siteId: string, startDate: string, endDate: string): Promise<PageAnalytics[]> {
  await checkAuth();
  return getPageAnalytics(siteId, startDate, endDate);
} 