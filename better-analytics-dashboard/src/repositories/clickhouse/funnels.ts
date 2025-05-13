import { clickhouse } from '@/lib/clickhouse';
import { z } from 'zod';

import { SQL, safeSql } from '@/lib/safe-sql';

export async function getFunnelDetails(siteId: string, pages: string[]): Promise<number[]> {

  const taggedSqlResponse = pages
    .map((page, index) => SQL.String({ [`page_${index}`]: page }))
    .map((page) => safeSql`url = ${page}`);

  const sql = safeSql`
    WITH
      -- Base pages funnel results
      baseFunnel AS (
          SELECT
              windowFunnel(24*60*60)(
                  timestamp,
                  ${SQL.SEPARATOR(taggedSqlResponse)}
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
  
  const result = await clickhouse.query(sql.taggedSql, {
    params: {
      ...sql.taggedParams,
      site_id: siteId,
      window_size: 24*60*60,
      levels_array: new Array(pages.length).fill(0).map((_, i) => i+1)
    },
  }).toPromise() as any[];

  return result.map((res) => z.number().parse(res.count));
}

