'server-only';

import { getReferrerDistribution } from '@/repositories/clickhouse';
import { toDateTimeString } from '@/utils/dateFormatters';
import { ReferrerSourceAggregation } from '@/entities/referrers';

/**
 * Gets the aggregated referrers by source for a given site and time period
 */
export async function getReferrerSourceAggregationDataForSite(
  siteId: string, 
  startDate: string, 
  endDate: string
): Promise<ReferrerSourceAggregation[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  return getReferrerDistribution(siteId, formattedStart, formattedEnd);
}