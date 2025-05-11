import { clickhouse } from '@/lib/clickhouse';
import { z } from 'zod';

export async function getFunnelDetails(siteId: string, pages: string[]): Promise<number[]> {
  
  const query = `
    WITH
      -- Base pages funnel results
      baseFunnel AS (
          SELECT
              windowFunnel(24*60*60)(
                  timestamp,
                  url = 'http://localhost:3000/dashboard',
                  url = 'http://localhost:3000/dashboard/pages',
                  url = 'http://localhost:3000/dashboard/geography'
              ) AS level
          FROM analytics.events
          WHERE site_id = {site_id:String}
          GROUP BY visitor_id
      ),
      -- Aggregate by level
      funnelCounts AS (
          SELECT
              level,
              count() AS raw_count
          FROM baseFunnel
          GROUP BY level
      ),
      -- Static funnel levels
      levels AS (
          SELECT arrayJoin({levels_array:Array(UInt32)}) AS level
      ),
      -- Left join counts with all levels
      joined AS (
          SELECT
              levels.level,
              coalesce(funnelCounts.raw_count, 0) AS count
          FROM levels
          LEFT JOIN funnelCounts USING (level)
      )
    -- Cumulative aggregation on joined data
    SELECT
        sum(count) OVER (ORDER BY level DESC) AS count
    FROM joined
    ORDER BY level
  `;
  
  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      window_size: 24*60*60,
      levels_array: new Array(pages.length).fill(0).map((_, i) => i+1)
    },
  }).toPromise() as any[];

  return result.map((res) => z.number().parse(res.count));
}

