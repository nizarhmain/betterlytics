"use server";

import {
  getReferrerSourceAggregationDataForSite,
  getReferrerSummaryDataForSite,
  getReferrerTableDataForSite,
  getReferrerTrafficTrendBySourceDataForSite,
} from "@/services/referrers";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { withDashboardAuthContext } from "@/auth/auth-actions";
import { AuthContext } from "@/entities/authContext";

/**
 * Fetches the referrer distribution data for a site
 */
export const fetchReferrerSourceAggregationDataForSite =
  withDashboardAuthContext(
    async (ctx: AuthContext, startDate: Date, endDate: Date) => {
      try {
        const data = await getReferrerSourceAggregationDataForSite(
          ctx.siteId,
          startDate,
          endDate
        );
        return { data };
      } catch (error) {
        console.error("Error fetching referrer distribution:", error);
        throw error;
      }
    }
  );

/**
 * Fetches the referrer traffic trend data grouped by source type for a site with specified granularity
 */
export const fetchReferrerTrafficTrendBySourceDataForSite =
  withDashboardAuthContext(
    async (
      ctx: AuthContext,
      startDate: Date,
      endDate: Date,
      granularity: GranularityRangeValues
    ) => {
      try {
        const data = await getReferrerTrafficTrendBySourceDataForSite(
          ctx.siteId,
          startDate,
          endDate,
          granularity
        );
        return { data };
      } catch (error) {
        console.error(
          "Error fetching referrer traffic trend by source:",
          error
        );
        throw error;
      }
    }
  );

/**
 * Fetches the summary data for referrers including total count, traffic and bounce rate
 */
export const fetchReferrerSummaryDataForSite = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date) => {
    try {
      const data = await getReferrerSummaryDataForSite(
        ctx.siteId,
        startDate,
        endDate
      );
      return { data };
    } catch (error) {
      console.error("Error fetching referrer summary data:", error);
      throw error;
    }
  }
);

/**
 * Fetches detailed referrer data for table display
 */
export const fetchReferrerTableDataForSite = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    startDate: Date,
    endDate: Date,
    limit: number = 100
  ) => {
    try {
      const data = await getReferrerTableDataForSite(
        ctx.siteId,
        startDate,
        endDate,
        limit
      );
      return { data };
    } catch (error) {
      console.error("Error fetching referrer table data:", error);
      throw error;
    }
  }
);
