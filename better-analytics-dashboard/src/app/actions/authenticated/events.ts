'use server';

import { EventTypeRow } from "@/entities/events";
import { getCustomEventsOverviewForSite } from "@/services/events";
import { AuthContext } from "@/entities/authContext";

export async function fetchCustomEventsOverviewAction(ctx: AuthContext, startDate: Date, endDate: Date): Promise<EventTypeRow[]> {
  return getCustomEventsOverviewForSite(ctx.siteId, startDate, endDate);
}
