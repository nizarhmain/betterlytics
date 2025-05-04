'server-only';

import { getDeviceTypeBreakdown } from '@/repositories/clickhouse';
import { toDateTimeString } from '@/utils/dateFormatters';

export async function getDeviceTypeBreakdownForSite(siteId: string, startDate: string, endDate: string) {
  return getDeviceTypeBreakdown(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
}
