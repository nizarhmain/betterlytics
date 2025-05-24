'use server';

import { checkAuth } from "@/lib/auth-actions";
import { type Funnel, CreateFunnelSchema, FunnelDetails } from "@/entities/funnels";
import { createFunnelForSite, getFunnelDetailsById, getFunnelsBySiteId, getFunnelPreviewData } from "@/services/funnels";

export async function postFunnelAction(
  siteId: string, 
  name: string, 
  pages: string[], 
  isStrict: boolean
): Promise<Funnel> {
  await checkAuth();
  const funnel = CreateFunnelSchema.parse({
    siteId,
    name,
    pages,
    isStrict
  });
  return createFunnelForSite(funnel);
}

export async function fetchFunnelDetailsAction(
  siteId: string, 
  funnelId: string, 
): Promise<FunnelDetails> {
  await checkAuth();
  const funnel = await getFunnelDetailsById(siteId, funnelId);
  if (funnel === null) {
    throw 'Funnel not found'
  };

  return funnel;
}

export async function fetchFunnelsAction(siteId: string): Promise<FunnelDetails[]> {
  await checkAuth();
  return getFunnelsBySiteId(siteId);
}

export async function fetchFunnelPreviewAction(
  siteId: string, 
  funnelName: string, 
  pages: string[],
  isStrict: boolean
): Promise<FunnelDetails> {
  await checkAuth();
  return getFunnelPreviewData(
    siteId,
    funnelName,
    pages,
    isStrict
  );
}
