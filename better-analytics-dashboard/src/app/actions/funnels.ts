'use server';

import { checkAuth } from "@/lib/auth-actions";
import { type Funnel, CreateFunnelSchema } from "@/entities/funnels";
import { createFunnelForSite, getFunnelsBySiteId } from "@/services/funnels";

export async function postFunnelAction(siteId: string, name: string, pages: string[]): Promise<Funnel> {
  await checkAuth();
  const funnel = CreateFunnelSchema.parse({
    siteId,
    name,
    pages
  });
  return createFunnelForSite(funnel);
}

export async function fetchFunnelsAction(siteId: string): Promise<Funnel[]> {
  await checkAuth();
  return getFunnelsBySiteId(siteId);
}
