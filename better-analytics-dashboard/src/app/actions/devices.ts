'use server';

import { getDeviceTypeBreakdownForSite, getBrowserBreakdownForSite, getDeviceSummaryForSite, getOperatingSystemBreakdownForSite, getDeviceUsageTrendForSite } from "@/services/devices";
import { DeviceType, BrowserStats, DeviceSummary, OperatingSystemStats, DeviceUsageTrendRow } from "@/entities/devices";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { QueryFilter } from "@/entities/filter";
import { withDashboardAuthContext } from "./using-context-auth";
import { AuthContext } from "@/entities/authContext";

export const fetchDeviceTypeBreakdownAction = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<DeviceType[]> => {
  return getDeviceTypeBreakdownForSite(ctx.siteId, startDate, endDate, queryFilters);
});

export const fetchDeviceSummaryAction = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<DeviceSummary> => {
  return getDeviceSummaryForSite(ctx.siteId, startDate, endDate, queryFilters);
});

export const fetchBrowserBreakdownAction = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<BrowserStats[]> => {
  return getBrowserBreakdownForSite(ctx.siteId, startDate, endDate, queryFilters);
});

export const fetchOperatingSystemBreakdownAction = withDashboardAuthContext(
  async (ctx: AuthContext, startDate: Date, endDate: Date, queryFilters: QueryFilter[]): Promise<OperatingSystemStats[]> => {
  return getOperatingSystemBreakdownForSite(ctx.siteId, startDate, endDate, queryFilters);
});

export const fetchDeviceUsageTrendAction = withDashboardAuthContext(async (
  ctx: AuthContext,
  startDate: Date, 
  endDate: Date,
  granularity: GranularityRangeValues,
  queryFilters: QueryFilter[]
): Promise<DeviceUsageTrendRow[]> => {
  return getDeviceUsageTrendForSite(ctx.siteId, startDate, endDate, granularity, queryFilters);
});
