'server only';

import { type EventTypeRow } from "@/entities/events";
import { usingAuthContext } from "./using-context-auth";
import { getCustomEventsOverviewForSite } from "@/services/events";

export async function fetchCustomEventsOverviewAction(dashboardId: string, startDate: Date, endDate: Date): Promise<EventTypeRow[]> {
  const ctx = await usingAuthContext(dashboardId);
  return getCustomEventsOverviewForSite(ctx.siteId, startDate, endDate);
}
