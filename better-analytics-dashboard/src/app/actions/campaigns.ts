"use server";

import { fetchCampaignPerformance as fetchCampaignPerformanceService } from "@/services/campaign";
import { CampaignPerformance } from "@/entities/campaign";
import { checkAuth } from "@/lib/auth-actions";

export async function fetchCampaignPerformanceAction(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<CampaignPerformance[]> {
  await checkAuth();

  try {
    const performanceData = await fetchCampaignPerformanceService(
      siteId,
      startDate,
      endDate
    );
    return performanceData;
  } catch (error) {
    console.error("Error in fetchCampaignPerformanceAction:", error);
    return [];
  }
} 