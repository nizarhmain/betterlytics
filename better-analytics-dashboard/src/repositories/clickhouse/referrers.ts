import { ReferrerSourceAggregation, ReferrerSourceAggregationSchema } from '@/entities/referrers';
import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from '@/types/dates';

/**
 * Get the distribution of referrers by source type
 */
export async function getReferrerDistribution(
  siteId: string, 
  startDate: DateTimeString, 
  endDate: DateTimeString
): Promise<ReferrerSourceAggregation[]> {
  const query = `
    SELECT 
      referrer_source,
      count() as visitorCount
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp >= {start:DateTime}
      AND timestamp <= {end:DateTime}
    GROUP BY referrer_source
    ORDER BY visitorCount DESC
  `;

  const result = await clickhouse.query(query, {
    params: { 
      site_id: siteId, 
      start: startDate, 
      end: endDate 
    },
  }).toPromise() as any[];
  
  return ReferrerSourceAggregationSchema.array().parse(result);
} 