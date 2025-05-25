"use server";

import {
  type Funnel,
  CreateFunnelSchema,
  FunnelDetails,
} from "@/entities/funnels";
import {
  createFunnelForDashboard,
  getFunnelDetailsById,
  getFunnelPreviewData,
  getFunnelsByDashboardId,
} from "@/services/funnels";
import { withDashboardAuthContext } from "@/auth/auth-actions";
import { AuthContext } from "@/entities/authContext";

export const postFunnelAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    name: string,
    pages: string[],
    isStrict: boolean
  ): Promise<Funnel> => {
    const funnel = CreateFunnelSchema.parse({
      siteId: ctx.siteId,
      name,
      pages,
      isStrict,
    });
    return createFunnelForDashboard(funnel);
  }
);

export const fetchFunnelDetailsAction = withDashboardAuthContext(
  async (ctx: AuthContext, funnelId: string): Promise<FunnelDetails> => {
    const funnel = await getFunnelDetailsById(ctx.siteId, funnelId);
    if (funnel === null) {
      throw new Error("Funnel not found");
    }

    return funnel;
  }
);

export const fetchFunnelsAction = withDashboardAuthContext(
  async (ctx: AuthContext): Promise<FunnelDetails[]> => {
    return getFunnelsByDashboardId(ctx.dashboardId, ctx.siteId);
  }
);

export const fetchFunnelPreviewAction = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    funnelName: string,
    pages: string[],
    isStrict: boolean
  ): Promise<FunnelDetails> => {
    return getFunnelPreviewData(ctx.siteId, funnelName, pages, isStrict);
  }
);
