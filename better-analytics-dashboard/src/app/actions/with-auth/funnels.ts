'server only';

import { type Funnel, CreateFunnelSchema, FunnelDetails, CreateFunnel } from "@/entities/funnels";
import { createFunnelForDashboard, getFunnelDetailsById, getFunnelsByDashboardId } from "@/services/funnels";
import { AuthContext } from "@/entities/authContext";

export async function postFunnelAction(ctx: AuthContext, name: string, pages: string[]): Promise<Funnel> {
  const dashboardId = ctx.dashboardId;

  const funnelDataToParse: CreateFunnel = {
    dashboardId,
    name,
    pages
  };
  const funnel = CreateFunnelSchema.parse(funnelDataToParse);
  return createFunnelForDashboard(funnel);
}

export async function fetchFunnelDetailsAction(ctx: AuthContext, funnelId: string): Promise<FunnelDetails> {
  const funnel = await getFunnelDetailsById(ctx.dashboardId, funnelId);
  if (funnel === null) {
    throw new Error('Funnel not found');
  };

  return funnel;
}

export async function fetchFunnelsAction(ctx: AuthContext): Promise<FunnelDetails[]> {
  return getFunnelsByDashboardId(ctx.dashboardId);
}
