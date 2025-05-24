'server only';

import {
  fetchCampaignPerformance,
  fetchCampaignSourceBreakdown,
  fetchCampaignVisitorTrend,
  fetchCampaignMediumBreakdown,
  fetchCampaignContentBreakdown,
  fetchCampaignTermBreakdown,
  fetchCampaignLandingPagePerformance,
} from "@/services/campaign";
import {
  CampaignPerformance,
  CampaignSourceBreakdownItem,
  PivotedCampaignVisitorTrendItem,
  CampaignMediumBreakdownItem,
  CampaignContentBreakdownItem,
  CampaignTermBreakdownItem,
  CampaignLandingPagePerformanceItem,
} from "@/entities/campaign";
import { usingAuthContext } from "./using-context-auth";

export async function fetchCampaignPerformanceAction(
  dashboardId: string,
  startDate: Date,
  endDate: Date
): Promise<CampaignPerformance[]> {
  const ctx = await usingAuthContext(dashboardId);
  try {
    const performanceData = await fetchCampaignPerformance(
      ctx.siteId,
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
  dashboardId: string,
  startDate: Date,
  endDate: Date
): Promise<CampaignSourceBreakdownItem[]> {
  const ctx = await usingAuthContext(dashboardId);
  try {
    const breakdownData = await fetchCampaignSourceBreakdown(
      ctx.siteId,
      startDate,
      endDate
    );
    return breakdownData;
  } catch (error) {
    console.error("Error in fetchCampaignSourceBreakdownAction:", error);
    return [];
  }
}

export async function fetchCampaignMediumBreakdownAction(
  dashboardId: string,
  startDate: Date,
  endDate: Date
): Promise<CampaignMediumBreakdownItem[]> {
  const ctx = await usingAuthContext(dashboardId);
  try {
    const breakdownData = await fetchCampaignMediumBreakdown(
      ctx.siteId,
      startDate,
      endDate
    );
    return breakdownData;
  } catch (error) {
    console.error("Error in fetchCampaignMediumBreakdownAction:", error);
    return [];
  }
}

export async function fetchCampaignContentBreakdownAction(
  dashboardId: string,
  startDate: Date,
  endDate: Date
): Promise<CampaignContentBreakdownItem[]> {
  const ctx = await usingAuthContext(dashboardId);
  try {
    const breakdownData = await fetchCampaignContentBreakdown(
      ctx.siteId,
      startDate,
      endDate
    );
    return breakdownData;
  } catch (error) {
    console.error("Error in fetchCampaignContentBreakdownAction:", error);
    return [];
  }
}

export async function fetchCampaignTermBreakdownAction(
  dashboardId: string,
  startDate: Date,
  endDate: Date
): Promise<CampaignTermBreakdownItem[]> {
  const ctx = await usingAuthContext(dashboardId);
  try {
    const breakdownData = await fetchCampaignTermBreakdown(
      ctx.siteId,
      startDate,
      endDate
    );
    return breakdownData;
  } catch (error) {
    console.error("Error in fetchCampaignTermBreakdownAction:", error);
    return [];
  }
}

export async function fetchCampaignLandingPagePerformanceAction(
  dashboardId: string,
  startDate: Date,
  endDate: Date
): Promise<CampaignLandingPagePerformanceItem[]> {
  const ctx = await usingAuthContext(dashboardId);
  try {
    const performanceData = await fetchCampaignLandingPagePerformance(
      ctx.siteId,
      startDate,
      endDate
    );
    return performanceData;
  } catch (error) {
    console.error("Error in fetchCampaignLandingPagePerformanceAction:", error);
    return [];
  }
}

export async function fetchCampaignVisitorTrendAction(
  dashboardId: string,
  startDate: Date,
  endDate: Date
): Promise<PivotedCampaignVisitorTrendItem[]> {
  const ctx = await usingAuthContext(dashboardId);
  try {
    return await fetchCampaignVisitorTrend(ctx.siteId, startDate, endDate);
  } catch (error) {
    console.error("Error in fetchCampaignVisitorTrendAction:", error);
    return [];
  }
} 