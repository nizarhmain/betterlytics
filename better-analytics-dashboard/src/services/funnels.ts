'server-only';

import { type Funnel, type CreateFunnel } from '@/entities/funnels';
import * as FunnelRepository from '@/repositories/postgres/funnels';

export async function getFunnelsBySiteId(siteId: string): Promise<Funnel[]> {
  return FunnelRepository.getFunnelsBySiteId(siteId);
}

export async function createFunnelForSite(funnel: CreateFunnel): Promise<Funnel> {
  return FunnelRepository.createFunnel(funnel);
}
