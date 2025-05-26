import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from '@/types/dates';
import { EventTypeRow, EventTypeRowSchema, RawEventPropertyData, RawEventPropertyDataArraySchema } from '@/entities/events';
import { safeSql } from '@/lib/safe-sql';

export async function getCustomEventsOverview(siteId: string, startDate: DateTimeString, endDate: DateTimeString): Promise<EventTypeRow[]> {
  const query = safeSql`
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
  const result = await clickhouse.query(query.taggedSql, {
    params: {
      ...query.taggedParams,
      site_id: siteId,
      start_date: startDate,
      end_date: endDate,
    },
  }).toPromise();
  
  return result.map(row => EventTypeRowSchema.parse(row));
}

export async function getEventPropertyData(
  siteId: string, 
  eventName: string, 
  startDate: DateTimeString, 
  endDate: DateTimeString
): Promise<RawEventPropertyData[]> {
  const eventsQuery = safeSql`
    SELECT custom_event_json
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND event_type = 'custom'
      AND custom_event_name = {event_name:String}
      AND timestamp BETWEEN {start_date:DateTime} AND {end_date:DateTime}
      AND custom_event_json != '{}'
      AND custom_event_json != ''
    LIMIT 10000
  `;

  const eventsResult = await clickhouse.query(eventsQuery.taggedSql, {
    params: {
      ...eventsQuery.taggedParams,
      site_id: siteId,
      event_name: eventName,
      start_date: startDate,
      end_date: endDate,
    },
  }).toPromise() as Array<{ custom_event_json: string }>;

  return RawEventPropertyDataArraySchema.parse(eventsResult);
}
