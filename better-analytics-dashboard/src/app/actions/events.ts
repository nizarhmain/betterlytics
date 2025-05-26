"use server";

import { withDashboardAuthContext } from "@/auth/auth-actions";
import { getCustomEventsOverviewForSite, getEventPropertiesAnalyticsForSite } from "@/services/events";
import { type AuthContext } from "@/entities/authContext";

export const fetchCustomEventsOverviewAction = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date) => {
    return getCustomEventsOverviewForSite(ctx.siteId, startDate, endDate);
  }
);

export const fetchEventPropertiesAnalyticsAction = withDashboardAuthContext(
  async (ctx: AuthContext, eventName: string, startDate: Date, endDate: Date) => {
    return getEventPropertiesAnalyticsForSite(ctx.siteId, eventName, startDate, endDate);
  }
);
