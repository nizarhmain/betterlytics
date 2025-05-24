'server only';

import { type EventTypeRow } from "@/entities/events";
import { type AuthContext } from "@/entities/authContext";
import { getCustomEventsOverviewForSite } from "@/services/events";

export async function fetchCustomEventsOverviewAction(ctx: AuthContext, startDate: Date, endDate: Date): Promise<EventTypeRow[]> {
  return getCustomEventsOverviewForSite(ctx.siteId, startDate, endDate);
}
