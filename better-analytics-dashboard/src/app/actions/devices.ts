'use server';

import { getDeviceTypeBreakdownForSite, getBrowserBreakdownForSite, getDeviceSummaryForSite, getOperatingSystemBreakdownForSite, getDeviceUsageTrendForSite } from "@/services/devices";
import { DeviceType, BrowserStats, DeviceSummary, OperatingSystemStats, DeviceUsageTrendRow } from "@/entities/devices";
import { checkAuth } from "@/lib/auth-actions";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { QueryFilter } from "@/entities/filter";

export async function fetchDeviceTypeBreakdownAction(siteId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<DeviceType[]> {
  await checkAuth();
  return getDeviceTypeBreakdownForSite(siteId, startDate, endDate, queryFilters);
}

export async function fetchDeviceSummaryAction(siteId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<DeviceSummary> {
  await checkAuth();
  return getDeviceSummaryForSite(siteId, startDate, endDate, queryFilters);
}

export async function fetchBrowserBreakdownAction(siteId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<BrowserStats[]> {
  await checkAuth();
  return getBrowserBreakdownForSite(siteId, startDate, endDate, queryFilters);
}

export async function fetchOperatingSystemBreakdownAction(siteId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<OperatingSystemStats[]> {
  await checkAuth();
  return getOperatingSystemBreakdownForSite(siteId, startDate, endDate, queryFilters);
}

export async function fetchDeviceUsageTrendAction(
  siteId: string, 
  startDate: Date, 
  endDate: Date,
  granularity: GranularityRangeValues,
  queryFilters: QueryFilter[]
): Promise<DeviceUsageTrendRow[]> {
  await checkAuth();
  return getDeviceUsageTrendForSite(siteId, startDate, endDate, granularity, queryFilters);
} 
