'server-only';

import { getCustomEventsOverview, getEventPropertyData } from '@/repositories/clickhouse';
import { toDateTimeString } from '@/utils/dateFormatters';
import { EventPropertiesOverview, EventPropertyAnalytics, EventPropertyValue } from '@/entities/events';

export async function getCustomEventsOverviewForSite(siteId: string, startDate: Date, endDate: Date) {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);
  return getCustomEventsOverview(siteId, formattedStart, formattedEnd);
}

export async function getEventPropertiesAnalyticsForSite(
  siteId: string, 
  eventName: string, 
  startDate: Date, 
  endDate: Date
): Promise<EventPropertiesOverview> {
  const formattedStart = toDateTimeString(startDate);
  const formattedEnd = toDateTimeString(endDate);

  const rawPropertyData = await getEventPropertyData(siteId, eventName, formattedStart, formattedEnd);
  
  const totalEvents = rawPropertyData.length;
  const properties = processPropertyData(rawPropertyData);

  return {
    eventName,
    totalEvents,
    properties,
  };
}

function processPropertyData(rawPropertyData: Array<{ custom_event_json: string }>): EventPropertyAnalytics[] {
  const propertyMap = new Map<string, Map<string, number>>();

  for (const row of rawPropertyData) {
    try {
      const properties = JSON.parse(row.custom_event_json);
      
      for (const [key, value] of Object.entries(properties)) {
        if (!propertyMap.has(key)) {
          propertyMap.set(key, new Map());
        }
        
        const valueStr = String(value);
        const valueMap = propertyMap.get(key)!;
        valueMap.set(valueStr, (valueMap.get(valueStr) || 0) + 1);
      }
    } catch (e) {
      // Skip invalid JSON
      continue;
    }
  }

  const properties: EventPropertyAnalytics[] = Array.from(propertyMap.entries()).map(([propertyName, valueMap]) => {
    const totalOccurrences = Array.from(valueMap.values()).reduce((sum, count) => sum + count, 0);
    const uniqueValueCount = valueMap.size;
    
    const topValues: EventPropertyValue[] = Array.from(valueMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([value, count]) => ({
        value,
        count,
        percentage: Math.round((count / totalOccurrences) * 100 * 100) / 100,
      }));

    return {
      propertyName,
      uniqueValueCount,
      totalOccurrences,
      topValues,
    };
  }).sort((a, b) => b.totalOccurrences - a.totalOccurrences);

  return properties;
}
