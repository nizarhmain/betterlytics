import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from '@/types/dates';
import { GeoVisitor, GeoVisitorSchema } from '@/entities/geography';
import { safeSql } from '@/lib/safe-sql';

/**
 * Retrieves visitor data aggregated by country code
 */
export async function getVisitorsByCountry(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString
): Promise<GeoVisitor[]> {
  const query = safeSql`
    SELECT
      country_code,
      uniq(visitor_id) as visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND country_code IS NOT NULL
      AND country_code != ''
    GROUP BY country_code
    ORDER BY visitors DESC
  `;

  const result = await clickhouse.query(query.taggedSql, {
    params: {
      ...query.taggedParams,
      site_id: siteId,
      start: startDate,
      end: endDate,
    },
  }).toPromise() as any[];

  return result.map(row => 
    GeoVisitorSchema.parse({
      country_code: row.country_code,
      visitors: Number(row.visitors)
    })
  );
}