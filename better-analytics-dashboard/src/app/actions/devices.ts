'use server';

import { getDeviceTypeBreakdownForSite, getBrowserBreakdownForSite, getDeviceSummaryForSite } from "@/services/devices";
import { DeviceType, BrowserStats, DeviceSummary } from "@/entities/devices";
import { checkAuth } from "@/lib/auth-actions";

export async function fetchDeviceTypeBreakdownAction(siteId: string, startDate: Date, endDate: Date): Promise<DeviceType[]> {
  await checkAuth();
  return getDeviceTypeBreakdownForSite(siteId, startDate, endDate);
}

export async function fetchDeviceSummaryAction(siteId: string, startDate: Date, endDate: Date): Promise<DeviceSummary> {
  await checkAuth();
  return getDeviceSummaryForSite(siteId, startDate, endDate);
}

export async function fetchBrowserBreakdownAction(siteId: string, startDate: Date, endDate: Date): Promise<BrowserStats[]> {
  await checkAuth();
  return getBrowserBreakdownForSite(siteId, startDate, endDate);
} 
