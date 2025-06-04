'server-only';

import { type Funnel, type CreateFunnel, FunnelDetails, FunnelDetailsSchema } from '@/entities/funnels';
import * as PostgresFunnelRepository from '@/repositories/postgres/funnels';
import * as ClickhouseFunnelRepository from '@/repositories/clickhouse/funnels';
import { type QueryFilter } from '@/entities/filter';
import { subHours, endOfHour } from 'date-fns';
import { toDateTimeString } from '@/utils/dateFormatters';

export async function getFunnelsByDashboardId(dashboardId: string, siteId: string): Promise<FunnelDetails[]> {
  const funnels = await PostgresFunnelRepository.getFunnelsByDashboardId(dashboardId);

  const funnelsDetails = await Promise.all(
    funnels.map(async (funnel: Funnel) =>
      FunnelDetailsSchema.parse({
        ...funnel,
        visitors: await ClickhouseFunnelRepository.getFunnelDetails(siteId, funnel.pages, funnel.isStrict),
      }),
    ),
  );
  return funnelsDetails;
}

export async function getFunnelDetailsById(siteId: string, funnelId: string): Promise<FunnelDetails | null> {
  const funnel = await PostgresFunnelRepository.getFunnelById(funnelId);

  if (funnel === null) {
    return null;
  }

  const visitors = await ClickhouseFunnelRepository.getFunnelDetails(siteId, funnel.pages, funnel.isStrict);

  return FunnelDetailsSchema.parse({
    ...funnel,
    visitors,
    isStrict: funnel.isStrict,
  });
}

export async function createFunnelForDashboard(funnel: CreateFunnel): Promise<Funnel> {
  return PostgresFunnelRepository.createFunnel(funnel);
}

export async function getFunnelPreviewData(
  siteId: string,
  funnelName: string,
  pages: string[],
  isStrict: boolean,
): Promise<FunnelDetails> {
  const endDate = endOfHour(new Date());
  const startDate = subHours(endDate, 24);
  const queryFilters: QueryFilter[] = [];

  const visitors = await ClickhouseFunnelRepository.getFunnelDetails(
    siteId,
    pages,
    isStrict,
    toDateTimeString(startDate),
    toDateTimeString(endDate),
    queryFilters,
  );

  return FunnelDetailsSchema.parse({
    id: 'cmbb2vpw00004uzmwb4t3cdpw',
    dashboardId: 'cmbb2vpw00004uzmwb4t3cdpw',
    name: funnelName,
    pages,
    visitors,
    isStrict,
  });
}
