'use server';

import { requireDashboardAuth } from "@/lib/auth-actions";
import { type Funnel, CreateFunnelSchema, FunnelDetails, CreateFunnel } from "@/entities/funnels";
import { createFunnelForDashboard, getFunnelDetailsById, getFunnelsByDashboardId } from "@/services/funnels";

export async function postFunnelAction(name: string, pages: string[]): Promise<Funnel> {
  const session = await requireDashboardAuth();
  const dashboardId = session.dashboardId;

  const funnelDataToParse: CreateFunnel = {
    dashboardId,
    name,
    pages
  };
  const funnel = CreateFunnelSchema.parse(funnelDataToParse);
  return createFunnelForDashboard(funnel);
}

export async function fetchFunnelDetailsAction(funnelId: string): Promise<FunnelDetails> {
  const session = await requireDashboardAuth();
  const dashboardId = session.dashboardId;

  const funnel = await getFunnelDetailsById(dashboardId, funnelId);
  if (funnel === null) {
    throw new Error('Funnel not found');
  };

  return funnel;
}

export async function fetchFunnelsAction(): Promise<FunnelDetails[]> {
  const session = await requireDashboardAuth();
  const dashboardId = session.dashboardId;
  
  return getFunnelsByDashboardId(dashboardId);
}
