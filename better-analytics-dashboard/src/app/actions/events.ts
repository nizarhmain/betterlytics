'use server';

import { checkAuth } from "@/lib/auth-actions";
import { EventTypeRow } from "@/entities/events";
import { getCustomEventsOverviewForSite } from "@/services/events";

export async function fetchCustomEventsOverviewAction(siteId: string, startDate: string, endDate: string): Promise<EventTypeRow[]> {
  await checkAuth();
  return getCustomEventsOverviewForSite(siteId, startDate, endDate);
}
