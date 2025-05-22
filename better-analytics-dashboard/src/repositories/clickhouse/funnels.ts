import { z } from 'zod';
import { clickhouse } from '@/lib/clickhouse';
import { SQL, safeSql } from '@/lib/safe-sql';
import { type QueryFilter } from '@/entities/filter';
import { BAQuery } from '@/lib/ba-query';
import { DateTimeString } from '@/types/dates';

export async function getFunnelDetails(
  siteId: string,
  pages: string[],
  startDate?: DateTimeString, 
  endDate?: DateTimeString, 
  queryFilters?: QueryFilter[] 
): Promise<number[]> {

  const urlPagesEqualityChecks = pages
    .map((page, index) => SQL.String({ [`page_${index}`]: page }))
    .map((page) => safeSql`url = ${page}`);

  const levelsArray = new Array(pages.length).fill(0).map((_, i) => i + 1);

  const whereConditions = [safeSql`site_id = ${SQL.String({ siteId })}`];

  if (startDate && endDate) {
    whereConditions.push(safeSql`timestamp BETWEEN ${SQL.DateTime({ query_start_date: startDate })} AND ${SQL.DateTime({ query_end_date: endDate })}`);
  }

  const parsedFilters = BAQuery.getFilterQuery(queryFilters || []);
  whereConditions.push(SQL.AND(parsedFilters));

  const sql = safeSql`
    WITH
      baseFunnel AS (
          SELECT
              windowFunnel(24*60*60)(
                  timestamp,
                  ${SQL.SEPARATOR(urlPagesEqualityChecks)}
              ) AS level
          FROM analytics.events
          WHERE ${SQL.AND(whereConditions)} 
          GROUP BY visitor_id
      ),
      funnelCounts AS (
          SELECT
              level,
              count() AS raw_count
          FROM baseFunnel
          GROUP BY level
      ),
      levels AS (
          SELECT arrayJoin(${SQL.UInt32Array({ levels_array: levelsArray })}) AS level
      ),
      joined AS (
          SELECT
              levels.level,
              coalesce(funnelCounts.raw_count, 0) AS count
          FROM levels
          LEFT JOIN funnelCounts USING (level)
      )
    SELECT
        sum(count) OVER (ORDER BY level DESC) AS count
    FROM joined
    ORDER BY level
  `;

  const result = await clickhouse.query(
    sql.taggedSql,
    { params: sql.taggedParams } 
  ).toPromise() as any[];

  return result.map((res) => z.number().parse(res.count));
}

