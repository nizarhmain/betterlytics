'server only';

import { getDeviceTypeBreakdownForSite, getBrowserBreakdownForSite, getDeviceSummaryForSite, getOperatingSystemBreakdownForSite, getDeviceUsageTrendForSite } from "@/services/devices";
import { DeviceType, BrowserStats, DeviceSummary, OperatingSystemStats, DeviceUsageTrendRow } from "@/entities/devices";
import { requireDashboardAuth } from "@/lib/auth-actions";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { QueryFilter } from "@/entities/filter";
import { AuthContext } from "@/entities/authContext";

export async function fetchDeviceTypeBreakdownAction(ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<DeviceType[]> {
  return getDeviceTypeBreakdownForSite(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchDeviceSummaryAction(ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<DeviceSummary> {
  return getDeviceSummaryForSite(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchBrowserBreakdownAction(ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<BrowserStats[]> {
  return getBrowserBreakdownForSite(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchOperatingSystemBreakdownAction(ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<OperatingSystemStats[]> {
  return getOperatingSystemBreakdownForSite(ctx.siteId, startDate, endDate, queryFilters);
}

export async function fetchDeviceUsageTrendAction(
  ctx: AuthContext,
  startDate: Date, 
  endDate: Date,
  granularity: GranularityRangeValues,
  queryFilters: QueryFilter[]
): Promise<DeviceUsageTrendRow[]> {
  await requireDashboardAuth();
  return getDeviceUsageTrendForSite(ctx.siteId, startDate, endDate, granularity, queryFilters);
} 
