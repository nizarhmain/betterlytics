"use server";

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
import { withDashboardAuthContext } from "@/auth/auth-actions";
import { AuthContext } from "@/entities/authContext";

export const fetchCampaignPerformanceAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date
  ): Promise<CampaignPerformance[]> => {
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
);

export const fetchCampaignSourceBreakdownAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date
  ): Promise<CampaignSourceBreakdownItem[]> => {
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
);

export const fetchCampaignMediumBreakdownAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date
  ): Promise<CampaignMediumBreakdownItem[]> => {
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
);

export const fetchCampaignContentBreakdownAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date
  ): Promise<CampaignContentBreakdownItem[]> => {
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
);

export const fetchCampaignTermBreakdownAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date
  ): Promise<CampaignTermBreakdownItem[]> => {
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
);

export const fetchCampaignLandingPagePerformanceAction =
  withDashboardAuthContext(
    async (
      ctx: AuthContext,
      startDate: Date,
      endDate: Date
    ): Promise<CampaignLandingPagePerformanceItem[]> => {
      try {
        const performanceData = await fetchCampaignLandingPagePerformance(
          ctx.siteId,
          startDate,
          endDate
        );
        return performanceData;
      } catch (error) {
        console.error(
          "Error in fetchCampaignLandingPagePerformanceAction:",
          error
        );
        return [];
      }
    }
  );

export const fetchCampaignVisitorTrendAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date
  ): Promise<PivotedCampaignVisitorTrendItem[]> => {
    try {
      return await fetchCampaignVisitorTrend(ctx.siteId, startDate, endDate);
    } catch (error) {
      console.error("Error in fetchCampaignVisitorTrendAction:", error);
      return [];
    }
  }
);
