

"use server";

/**
 * THIS FILE IS AUTO-GENERATED - DO NOT EDIT DIRECTLY
 */

// Import actions requiring auth wrapping
import * as authenticated from './with-auth'

// Imports
import { AuthContext } from "@/entities/authContext";
import { requireDashboardAuth } from "@/lib/auth-actions";
import { authorizeUserDashboard } from "@/services/auth.service";

// Type definitions
type GetAuthRestProps<T> = T extends (context: AuthContext, ...args: infer Args) => unknown ? Args : never;

// Auth context
async function usingAuthContext(dashboardId: string): Promise<AuthContext> {
  const session = await requireDashboardAuth();
  const context = await authorizeUserDashboard(session.user.id, dashboardId);
  return context;
}


// Functions

export async function fetchCampaignPerformanceAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchCampaignPerformanceAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchCampaignPerformanceAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchCampaignPerformanceAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchCampaignSourceBreakdownAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchCampaignSourceBreakdownAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchCampaignSourceBreakdownAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchCampaignSourceBreakdownAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchCampaignMediumBreakdownAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchCampaignMediumBreakdownAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchCampaignMediumBreakdownAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchCampaignMediumBreakdownAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchCampaignContentBreakdownAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchCampaignContentBreakdownAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchCampaignContentBreakdownAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchCampaignContentBreakdownAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchCampaignTermBreakdownAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchCampaignTermBreakdownAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchCampaignTermBreakdownAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchCampaignTermBreakdownAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchCampaignLandingPagePerformanceAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchCampaignLandingPagePerformanceAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchCampaignLandingPagePerformanceAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchCampaignLandingPagePerformanceAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchCampaignVisitorTrendAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchCampaignVisitorTrendAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchCampaignVisitorTrendAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchCampaignVisitorTrendAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchDeviceTypeBreakdownAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchDeviceTypeBreakdownAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchDeviceTypeBreakdownAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchDeviceTypeBreakdownAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchDeviceSummaryAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchDeviceSummaryAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchDeviceSummaryAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchDeviceSummaryAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchBrowserBreakdownAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchBrowserBreakdownAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchBrowserBreakdownAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchBrowserBreakdownAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchOperatingSystemBreakdownAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchOperatingSystemBreakdownAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchOperatingSystemBreakdownAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchOperatingSystemBreakdownAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchDeviceUsageTrendAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchDeviceUsageTrendAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchDeviceUsageTrendAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchDeviceUsageTrendAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchCustomEventsOverviewAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchCustomEventsOverviewAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchCustomEventsOverviewAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchCustomEventsOverviewAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function postFunnelAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.postFunnelAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.postFunnelAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "postFunnelAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchFunnelDetailsAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchFunnelDetailsAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchFunnelDetailsAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchFunnelDetailsAction:"', e);
    throw new Error('An error occurred');
  }
}

export async function fetchFunnelsAction(dashboardId: string, ...args: GetAuthRestProps<typeof authenticated.fetchFunnelsAction>) {
  const context = await usingAuthContext(dashboardId);
  try {
    return await authenticated.fetchFunnelsAction(context, ...args);
  } catch (e) {
    console.error('An error occured in "fetchFunnelsAction:"', e);
    throw new Error('An error occurred');
  }
}
