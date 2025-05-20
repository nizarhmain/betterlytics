'use server';

import { getDeviceTypeBreakdownForSite, getBrowserBreakdownForSite, getDeviceSummaryForSite, getOperatingSystemBreakdownForSite, getDeviceUsageTrendForSite } from "@/services/devices";
import { DeviceType, BrowserStats, DeviceSummary, OperatingSystemStats, DeviceUsageTrendRow } from "@/entities/devices";
import { requireDashboardAuth } from "@/lib/auth-actions";
import { GranularityRangeValues } from "@/utils/granularityRanges";

export async function fetchDeviceTypeBreakdownAction(siteId: string, startDate: Date, endDate: Date): Promise<DeviceType[]> {
  const session = await requireDashboardAuth();
  return getDeviceTypeBreakdownForSite(siteId, startDate, endDate);
}

export async function fetchDeviceSummaryAction(siteId: string, startDate: Date, endDate: Date): Promise<DeviceSummary> {
  const session = await requireDashboardAuth();
  return getDeviceSummaryForSite(siteId, startDate, endDate);
}

export async function fetchBrowserBreakdownAction(siteId: string, startDate: Date, endDate: Date): Promise<BrowserStats[]> {
  const session = await requireDashboardAuth();
  return getBrowserBreakdownForSite(siteId, startDate, endDate);
}

export async function fetchOperatingSystemBreakdownAction(siteId: string, startDate: Date, endDate: Date): Promise<OperatingSystemStats[]> {
  const session = await requireDashboardAuth();
  return getOperatingSystemBreakdownForSite(siteId, startDate, endDate);
}

export async function fetchDeviceUsageTrendAction(
  siteId: string, 
  startDate: Date, 
  endDate: Date,
  granularity: GranularityRangeValues
): Promise<DeviceUsageTrendRow[]> {
  const session = await requireDashboardAuth();
  return getDeviceUsageTrendForSite(siteId, startDate, endDate, granularity);
} 
