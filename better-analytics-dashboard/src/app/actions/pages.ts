'use server';

import { getPageAnalytics } from "@/services/pages";
import { PageAnalytics } from "@/types/analytics";

export async function fetchPageAnalyticsAction(siteId: string, startDate: string, endDate: string): Promise<PageAnalytics[]> {
  return getPageAnalytics(siteId, startDate, endDate);
} 