'use server';

import { getDeviceTypeBreakdownForSite, getBrowserBreakdownForSite, getDeviceSummaryForSite, getOperatingSystemBreakdownForSite } from "@/services/devices";
import { DeviceType, BrowserStats, DeviceSummary, OperatingSystemStats } from "@/entities/devices";
import { checkAuth } from "@/lib/auth-actions";

export async function fetchDeviceTypeBreakdownAction(siteId: string, startDate: string, endDate: string): Promise<DeviceType[]> {
  await checkAuth();
  return getDeviceTypeBreakdownForSite(siteId, startDate, endDate);
}

export async function fetchDeviceSummaryAction(siteId: string, startDate: string, endDate: string): Promise<DeviceSummary> {
  await checkAuth();
  return getDeviceSummaryForSite(siteId, startDate, endDate);
}

export async function fetchBrowserBreakdownAction(siteId: string, startDate: string, endDate: string): Promise<BrowserStats[]> {
  await checkAuth();
  return getBrowserBreakdownForSite(siteId, startDate, endDate);
}

export async function fetchOperatingSystemBreakdownAction(siteId: string, startDate: string, endDate: string): Promise<OperatingSystemStats[]> {
  await checkAuth();
  return getOperatingSystemBreakdownForSite(siteId, startDate, endDate);
} 
