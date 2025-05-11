import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from '@/types/dates';
import { EventTypeRow, EventTypeRowSchema } from '@/entities/events';

export async function getCustomEventsOverview(siteId: string, startDate: DateTimeString, endDate: DateTimeString): Promise<EventTypeRow[]> {
  const query = `
    SELECT
      custom_event_name as event_name,
      count() as count
    FROM analytics.events
    WHERE
          site_id = {site_id:String}
      AND event_type = 'custom' 
      AND timestamp BETWEEN {start_date:DateTime} AND {end_date:DateTime}
    GROUP BY event_name
    ORDER BY count DESC
    LIMIT 100
  `;
  const result = await clickhouse.query(query, {
    params: {
      site_id: siteId,
      start_date: startDate,
      end_date: endDate,
    },
  }).toPromise();
  return result.map(row => EventTypeRowSchema.parse(row));
}
