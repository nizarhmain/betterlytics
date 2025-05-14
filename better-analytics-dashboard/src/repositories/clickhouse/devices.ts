import { clickhouse } from '@/lib/clickhouse';
import { DateTimeString } from '@/types/dates';
import { 
  DeviceType, DeviceTypeSchema, 
  BrowserInfoSchema, BrowserInfo, 
  OperatingSystemInfoSchema, OperatingSystemInfo
} from '@/entities/devices';

export async function getDeviceTypeBreakdown(siteId: string, startDate: DateTimeString, endDate: DateTimeString): Promise<DeviceType[]> {
  const query = `
    SELECT device_type, uniq(visitor_id) as visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
    GROUP BY device_type
    ORDER BY visitors DESC
  `;
  const result = await clickhouse.query(query, {
    params: { site_id: siteId, start: startDate, end: endDate },
  }).toPromise() as any[];
  
  const mappedResults = result.map(row => ({
    device_type: row.device_type,
    visitors: Number(row.visitors)
  }));
  
  return DeviceTypeSchema.array().parse(mappedResults);
}

export async function getBrowserBreakdown(siteId: string, startDate: DateTimeString, endDate: DateTimeString): Promise<BrowserInfo[]> {
  const query = `
    SELECT browser, uniq(visitor_id) as visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
    GROUP BY browser
    ORDER BY visitors DESC
  `;
  const result = await clickhouse.query(query, {
    params: { site_id: siteId, start: startDate, end: endDate },
  }).toPromise() as any[];
  
  const mappedResults = result.map(row => ({
    browser: row.browser,
    visitors: Number(row.visitors)
  }));
  
  return BrowserInfoSchema.array().parse(mappedResults);
} 

export async function getOperatingSystemBreakdown(siteId: string, startDate: DateTimeString, endDate: DateTimeString): Promise<OperatingSystemInfo[]> {
  const query = `
    SELECT os, uniq(visitor_id) as visitors
    FROM analytics.events
    WHERE site_id = {site_id:String}
      AND timestamp BETWEEN {start:DateTime} AND {end:DateTime}
    GROUP BY os
    ORDER BY visitors DESC
  `;
  
  const result = await clickhouse.query(query, {
    params: { site_id: siteId, start: startDate, end: endDate },
  }).toPromise() as any[];
  
  const mappedResults = result.map(row => ({
    os: row.os,
    visitors: Number(row.visitors)
  }));
  
  return OperatingSystemInfoSchema.array().parse(mappedResults);
}