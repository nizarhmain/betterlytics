import { clickhouse } from '@/lib/clickhouse';
import { SequentialPath, SequentialPathSchema } from '@/entities/userJourney';
import { DateTimeString } from '@/types/dates';

/**
 * Gets complete sequential path data for sessions
 * This returns full paths like Home→Products→Cart grouped by frequency
 */
export async function getUserSequentialPaths(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  maxPathLength: number = 3,
  limit: number = 25
): Promise<SequentialPath[]> {
  const query = `
    WITH session_paths AS (
      SELECT
        session_id,
        arraySlice(groupArray(page_url ORDER BY timestamp), 1, {max_length:UInt8}) AS path
      FROM analytics.events
      WHERE
        site_id = {site_id:String}
        AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
        AND page_url IS NOT NULL AND page_url != ''
      GROUP BY session_id
      HAVING length(path) > 1
    )
    SELECT
      path,
      COUNT(*) AS count
    FROM session_paths
    GROUP BY path
    ORDER BY count DESC
    LIMIT {limit:UInt32}
  `;

  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
      max_length: maxPathLength,
      limit: limit
    },
  }).toPromise() as Array<{path: string[], count: number}>;
  
  return result.map(path => SequentialPathSchema.parse(path));
} 