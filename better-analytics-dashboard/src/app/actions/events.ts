"use server";

import { withDashboardAuthContext } from "@/auth/auth-actions";
import { getCustomEventsOverviewForSite } from "@/services/events";
import { type AuthContext } from "@/entities/authContext";

export const fetchCustomEventsOverviewAction = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date) => {
    return getCustomEventsOverviewForSite(ctx.siteId, startDate, endDate);
  }
);
