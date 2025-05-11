'use server';

import { checkAuth } from "@/lib/auth-actions";
import { type Funnel, CreateFunnelSchema } from "@/entities/funnels";
import { createFunnelForSite } from "@/services/funnels";

export async function postFunnelAction(siteId: string, name: string, pages: string[]): Promise<Funnel> {
  await checkAuth();
  const funnel = CreateFunnelSchema.parse({
    siteId,
    name,
    pages
  });
  return createFunnelForSite(funnel);
}
