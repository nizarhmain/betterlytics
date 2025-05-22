'server-only';

import { type Funnel, type CreateFunnel, FunnelDetails, FunnelDetailsSchema } from '@/entities/funnels';
import * as PostgresFunnelRepository from '@/repositories/postgres/funnels';
import * as ClickhouseFunnelRepository from '@/repositories/clickhouse/funnels';
import { type QueryFilter } from '@/entities/filter';
import { subHours, endOfHour } from 'date-fns';
import { toDateTimeString } from '@/utils/dateFormatters';

export async function getFunnelsBySiteId(siteId: string): Promise<FunnelDetails[]> {
  const funnels = await PostgresFunnelRepository.getFunnelsBySiteId(siteId);
  
  const funnelsDetails = await Promise.all(
      funnels.map(async (funnel: Funnel) => (
        FunnelDetailsSchema.parse({
          ...funnel,
          visitors: await ClickhouseFunnelRepository.getFunnelDetails(siteId, funnel.pages)
        })
      ))
  );
  return funnelsDetails;
}

export async function getFunnelDetailsById(siteId: string, funnelId: string): Promise<FunnelDetails | null> {
  const funnel = await PostgresFunnelRepository.getFunnelById(funnelId);

  if (funnel === null) {
    return null;
  }

  const visitors = await ClickhouseFunnelRepository.getFunnelDetails(siteId, funnel.pages);

  return FunnelDetailsSchema.parse({
    ...funnel,
    visitors
  });
}

export async function createFunnelForSite(funnel: CreateFunnel): Promise<Funnel> {
  return PostgresFunnelRepository.createFunnel(funnel);
}

export async function getFunnelPreviewData(
  siteId: string,
  funnelName: string,
  pages: string[],
): Promise<FunnelDetails> {
  
  const endDate = endOfHour(new Date());
  const startDate = subHours(endDate, 24);
  const queryFilters: QueryFilter[] = [];
  
  const visitors = await ClickhouseFunnelRepository.getFunnelDetails(
    siteId,
    pages,
    toDateTimeString(startDate),
    toDateTimeString(endDate),
    queryFilters
  );

  return FunnelDetailsSchema.parse({
    id: 'preview-funnel',
    name: funnelName,
    pages,
    visitors,
  });
}
