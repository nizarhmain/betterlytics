"use server";

import {
  fetchCampaignPerformance,
  fetchCampaignSourceBreakdown,
  fetchCampaignVisitorTrend,
} from "@/services/campaign";
import {
  CampaignPerformance,
  CampaignSourceBreakdownItem,
  PivotedCampaignVisitorTrendItem,
} from "@/entities/campaign";
import { checkAuth } from "@/lib/auth-actions";

export async function fetchCampaignPerformanceAction(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<CampaignPerformance[]> {
  await checkAuth();

  try {
    const performanceData = await fetchCampaignPerformance(
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

export async function fetchCampaignSourceBreakdownAction(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<CampaignSourceBreakdownItem[]> {
  await checkAuth();

  try {
    const breakdownData = await fetchCampaignSourceBreakdown(
      siteId,
      startDate,
      endDate
    );
    return breakdownData;
  } catch (error) {
    console.error("Error in fetchCampaignSourceBreakdownAction:", error);
    return [];
  }
}

export async function fetchCampaignVisitorTrendAction(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<PivotedCampaignVisitorTrendItem[]> {
  await checkAuth();
  try {
    return await fetchCampaignVisitorTrend(siteId, startDate, endDate);
  } catch (error) {
    console.error("Error in fetchCampaignVisitorTrendAction:", error);
    return [];
  }
} 