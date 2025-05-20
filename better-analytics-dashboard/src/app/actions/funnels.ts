'use server';

import { checkAuth } from "@/lib/auth-actions";
import { type Funnel, CreateFunnelSchema, FunnelDetails } from "@/entities/funnels";
import { createFunnelForDashboard, getFunnelDetailsById, getFunnelsByDashboardId } from "@/services/funnels";

export async function postFunnelAction(dashboardId: string, name: string, pages: string[]): Promise<Funnel> {
  await checkAuth();
  const funnel = CreateFunnelSchema.parse({
    dashboardId,
    name,
    pages
  });
  return createFunnelForDashboard(funnel);
}

export async function fetchFunnelDetailsAction(dashboardId: string, funnelId: string): Promise<FunnelDetails> {
  await checkAuth();
  const funnel = await getFunnelDetailsById(dashboardId, funnelId);
  if (funnel === null) {
    throw 'Funnel not found'
  };

  return funnel;
}


export async function fetchFunnelsAction(dashboardId: string): Promise<FunnelDetails[]> {
  await checkAuth();
  return getFunnelsByDashboardId(dashboardId);
}
