import { getVisitorsByCountry } from '@/repositories/clickhouse/geography';
import { toDateTimeString } from '@/utils/dateFormatters';
import { GeoVisitor } from '@/entities/geography';

/**
 * Fetches aggregrated visitor data by country code from the database
 */
export async function fetchVisitorsByGeography(
  siteId: string, 
  startDate: string, 
  endDate: string
): Promise<GeoVisitor[]> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  
  return getVisitorsByCountry(siteId, formattedStart, formattedEnd);
}