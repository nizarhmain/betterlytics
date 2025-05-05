'use server';

import { getDeviceTypeBreakdownForSite } from "@/services/devices";
import { DeviceType } from "@/entities/devices";
import { checkAuth } from "@/lib/auth-actions";

export async function fetchDeviceTypeBreakdownAction(siteId: string, startDate: string, endDate: string): Promise<DeviceType[]> {
  await checkAuth();
  return getDeviceTypeBreakdownForSite(siteId, startDate, endDate);
}