import { clickhouse } from '@/lib/clickhouse';
import { DailyUniqueVisitorsRow, DailyUniqueVisitorsRowSchema } from '@/entities/visitors';
import { DateString } from '@/types/dates';
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { BAQuery } from "@/lib/ba-query";

export async function getFunnel(siteId: string, startDate: DateString, endDate: DateString, granularity: GranularityRangeValues): Promise<DailyUniqueVisitorsRow[]> {
  
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
