'use server';

import { type Funnel, CreateFunnelSchema, FunnelDetails, CreateFunnel } from "@/entities/funnels";
import { createFunnelForDashboard, getFunnelDetailsById, getFunnelsByDashboardId } from "@/services/funnels";
import { withDashboardAuthContext } from "./using-context-auth";
import { AuthContext } from "@/entities/authContext";

export const postFunnelAction = withDashboardAuthContext(async (ctx: AuthContext, name: string, pages: string[]): Promise<Funnel> => {
  const funnelDataToParse: CreateFunnel = {
    dashboardId: ctx.dashboardId,
    name,
    pages
  };
  const funnel = CreateFunnelSchema.parse(funnelDataToParse);
  return createFunnelForDashboard(funnel);
})

export const fetchFunnelDetailsAction = withDashboardAuthContext(async (ctx: AuthContext, funnelId: string): Promise<FunnelDetails> => {
  const funnel = await getFunnelDetailsById(ctx.dashboardId, funnelId);
  if (funnel === null) {
    throw new Error('Funnel not found');
  };

  return funnel;
})

export const fetchFunnelsAction = withDashboardAuthContext(async (ctx: AuthContext): Promise<FunnelDetails[]> => {
  return getFunnelsByDashboardId(ctx.dashboardId);
})
