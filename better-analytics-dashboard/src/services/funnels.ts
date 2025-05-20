'server-only';

import { type Funnel, type CreateFunnel, FunnelDetails, FunnelDetailsSchema } from '@/entities/funnels';
import * as PostgresFunnelRepository from '@/repositories/postgres/funnels';
import * as ClickhouseFunnelRepository from '@/repositories/clickhouse/funnels';

export async function getFunnelsByDashboardId(dashboardId: string): Promise<FunnelDetails[]> {
  const funnels = await PostgresFunnelRepository.getFunnelsByDashboardId(dashboardId);
  
  const funnelsDetails = await Promise.all(
      funnels.map(async (funnel) => (
        FunnelDetailsSchema.parse({
          ...funnel,
          visitors: await ClickhouseFunnelRepository.getFunnelDetails(dashboardId, funnel.pages)
        })
      ))
  );
  return funnelsDetails;
}

export async function getFunnelDetailsById(dashboardId: string, funnelId: string): Promise<FunnelDetails | null> {
  const funnel = await PostgresFunnelRepository.getFunnelById(funnelId);

  if (funnel === null) {
    return null;
  }

  const visitors = await ClickhouseFunnelRepository.getFunnelDetails(dashboardId, funnel.pages);

  return FunnelDetailsSchema.parse({
    ...funnel,
    visitors
  });
}

export async function createFunnelForDashboard(funnel: CreateFunnel): Promise<Funnel> {
  return PostgresFunnelRepository.createFunnel(funnel);
}
