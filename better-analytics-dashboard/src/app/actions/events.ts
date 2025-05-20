'use server';

import { requireDashboardAuth } from "@/lib/auth-actions";
import { EventTypeRow } from "@/entities/events";
import { getCustomEventsOverviewForSite } from "@/services/events";

export async function fetchCustomEventsOverviewAction(siteId: string, startDate: Date, endDate: Date): Promise<EventTypeRow[]> {
  const session = await requireDashboardAuth();
  return getCustomEventsOverviewForSite(siteId, startDate, endDate);
}
