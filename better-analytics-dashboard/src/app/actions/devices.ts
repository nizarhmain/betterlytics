'server only';

import { getDeviceTypeBreakdownForSite, getBrowserBreakdownForSite, getDeviceSummaryForSite, getOperatingSystemBreakdownForSite, getDeviceUsageTrendForSite } from "@/services/devices";
import { DeviceType, BrowserStats, DeviceSummary, OperatingSystemStats, DeviceUsageTrendRow } from "@/entities/devices";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { QueryFilter } from "@/entities/filter";
import { usingAuthContext } from "./using-context-auth";

export async function fetchDeviceTypeBreakdownAction(dashboardId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<DeviceType[]> {
  const ctx = await usingAuthContext(dashboardId);
  return getDeviceTypeBreakdownForSite(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchDeviceSummaryAction(dashboardId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<DeviceSummary> {
  const ctx = await usingAuthContext(dashboardId);
  return getDeviceSummaryForSite(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchBrowserBreakdownAction(dashboardId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<BrowserStats[]> {
  const ctx = await usingAuthContext(dashboardId);
  return getBrowserBreakdownForSite(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchOperatingSystemBreakdownAction(dashboardId: string, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<OperatingSystemStats[]> {
  const ctx = await usingAuthContext(dashboardId);
  return getOperatingSystemBreakdownForSite(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchDeviceUsageTrendAction(
  dashboardId: string,
  startDate: Date, 
  endDate: Date,
  granularity: GranularityRangeValues,
  queryFilters: QueryFilter[]
): Promise<DeviceUsageTrendRow[]> {
  const ctx = await usingAuthContext(dashboardId);
  return getDeviceUsageTrendForSite(ctx.siteId, startDate, endDate, granularity, queryFilters);
} 
