'server-only';

import { getDeviceTypeBreakdown, getBrowserBreakdown } from '@/repositories/clickhouse/devices';
import { toDateTimeString } from '@/utils/dateFormatters';
import { DeviceType, BrowserStats, BrowserStatsSchema, DeviceSummary, DeviceSummarySchema } from '@/entities/devices';
import { getDeviceLabel } from '@/constants/deviceTypes';

export async function getDeviceTypeBreakdownForSite(siteId: string, startDate: string, endDate: string): Promise<DeviceType[]> {
  return getDeviceTypeBreakdown(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
}

export async function getDeviceSummaryForSite(siteId: string, startDate: string, endDate: string): Promise<DeviceSummary> {
  const deviceBreakdown = await getDeviceTypeBreakdown(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
  
  if (deviceBreakdown.length === 0) {
    return {
      distinctDeviceCount: 0,
      topDevice: {
        name: 'Unknown',
        visitors: 0,
        percentage: 0
      }
    };
  }
  
  // Calculate total visitors for percentage calculation
  const totalVisitors = deviceBreakdown.reduce((sum, device) => sum + device.visitors, 0);
  
  // Find the top device
  const topDevice = [...deviceBreakdown].sort((a, b) => b.visitors - a.visitors)[0];
  
  // Calculate percentage for top device
  const percentage = Math.round((topDevice.visitors / totalVisitors) * 100);
  
  const summary = {
    distinctDeviceCount: deviceBreakdown.length,
    topDevice: {
      name: getDeviceLabel(topDevice.device_type),
      visitors: topDevice.visitors,
      percentage
    }
  };
  
  return DeviceSummarySchema.parse(summary);
}

export async function getBrowserBreakdownForSite(siteId: string, startDate: string, endDate: string): Promise<BrowserStats[]> {
  const browserData = await getBrowserBreakdown(siteId, toDateTimeString(startDate), toDateTimeString(endDate));
  
  // Calculate total visitors for percentage calculation
  const totalVisitors = browserData.reduce((sum, item) => sum + item.visitors, 0);
  
  const statsWithPercentages = browserData.map(item => ({
    browser: item.browser,
    visitors: item.visitors,
    percentage: Math.round((item.visitors / totalVisitors) * 100)
  }));
  
  return BrowserStatsSchema.array().parse(statsWithPercentages);
}
