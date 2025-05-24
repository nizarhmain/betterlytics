'server only';

import { type Funnel, CreateFunnelSchema, FunnelDetails, CreateFunnel } from "@/entities/funnels";
import { createFunnelForDashboard, getFunnelDetailsById, getFunnelsByDashboardId } from "@/services/funnels";
import { usingAuthContext } from "./using-context-auth";

export async function postFunnelAction(dashboardId: string, name: string, pages: string[]): Promise<Funnel> {
  const ctx = await usingAuthContext(dashboardId);

  const funnelDataToParse: CreateFunnel = {
    dashboardId: ctx.dashboardId,
    name,
    pages
  };
  const funnel = CreateFunnelSchema.parse(funnelDataToParse);
  return createFunnelForDashboard(funnel);
}

export async function fetchFunnelDetailsAction(dashboardId: string, funnelId: string): Promise<FunnelDetails> {
  const ctx = await usingAuthContext(dashboardId);
  const funnel = await getFunnelDetailsById(ctx.dashboardId, funnelId);
  if (funnel === null) {
    throw new Error('Funnel not found');
  };

  return funnel;
}

export async function fetchFunnelsAction(dashboardId: string): Promise<FunnelDetails[]> {
  const ctx = await usingAuthContext(dashboardId);
  return getFunnelsByDashboardId(ctx.dashboardId);
}
