import { clickhouse } from '@/lib/clickhouse';
import { DailyUniqueVisitorsRow, DailyUniqueVisitorsRowSchema } from '@/entities/visitors';
import { DateString, DateTimeString } from '@/types/dates';
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { BAQuery } from "@/lib/ba-query";
import { QueryFilter } from "@/entities/filter";
import { safeSql, SQL } from "@/lib/safe-sql";

export async function getUniqueVisitors(siteId: string, startDate: DateString, endDate: DateString, granularity: GranularityRangeValues): Promise<DailyUniqueVisitorsRow[]> {
  
  const granularityFunc = BAQuery.getGranularitySQLFunctionFromGranularityRange(granularity);

  const query = `
    SELECT
      ${granularityFunc}(timestamp) as date,
      uniq(session_id) as unique_visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND date BETWEEN {start:DateTime} AND {end:DateTime}
    GROUP BY date
    ORDER BY date ASC
    LIMIT 10080
  `;
  
  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start: startDate,
      end: endDate,
    },
  }).toPromise() as any[];
  return result.map(row => DailyUniqueVisitorsRowSchema.parse(row));
}

export async function getTotalUniqueVisitors(
  siteId: string,
  startDate: DateString,
  endDate: DateString,
  queryFilters: QueryFilter[]
): Promise<number> {
  const filters = BAQuery.getFilterQuery(queryFilters);
  
  const queryResponse = safeSql`
    SELECT uniq(session_id) as unique_sessions
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
      AND ${SQL.AND(filters)}
  `;

  const result = await clickhouse.query(queryResponse.taggedSql, {
    params: {
      ...queryResponse.taggedParams,
      site_id: siteId,
      start: startDate,
      end: endDate,
    },
  }).toPromise() as any[];
  return Number(result[0]?.unique_sessions ?? 0);
}

export async function getSessionMetrics(
  siteId: string,
  startDate: DateTimeString,
  endDate: DateTimeString,
  queryFilters: QueryFilter[]
): Promise<{
  total_sessions: number;
  multi_page_sessions: number;
  total_duration: number;
  avg_duration: number;
}> {
  const filters = BAQuery.getFilterQuery(queryFilters);
  
  const queryResponse = safeSql`
    WITH session_data AS (
      SELECT
        session_id,
        count() as page_count,
        if(count() > 1,
          dateDiff('second', min(timestamp), max(timestamp)),
          0
        ) as duration_seconds
      FROM analytics.events
      WHERE site_id = {site_id:String}
        AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
        AND ${SQL.AND(filters)}
      GROUP BY session_id
    )
    SELECT 
      count() as total_sessions,
      countIf(page_count > 1) as multi_page_sessions,
      sum(duration_seconds) as total_duration_seconds,
      avgIf(duration_seconds, page_count > 1) as avg_duration_seconds
    FROM session_data
  `;
  
  const result = await clickhouse.query(queryResponse.taggedSql, {
    params: {
      ...queryResponse.taggedParams,
      site_id: siteId,
      start: startDate,
      end: endDate
    }
  }).toPromise() as Array<{
    total_sessions: string;
    multi_page_sessions: string;
    total_duration_seconds: string;
    avg_duration_seconds: string;
  }>;
  
  const row = result[0];
  return {
    total_sessions: Number(row?.total_sessions ?? 0),
    multi_page_sessions: Number(row?.multi_page_sessions ?? 0),
    total_duration: Number(row?.total_duration_seconds ?? 0),
    avg_duration: Number(row?.avg_duration_seconds ?? 0)
  };
} 