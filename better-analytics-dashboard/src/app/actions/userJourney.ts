'server only';

import { getUserJourneyForSankeyDiagram } from "@/services/userJourney";
import { SankeyData } from "@/entities/userJourney";
import { QueryFilter } from "@/entities/filter";
import { usingAuthContext } from "./using-context-auth";

/**
 * Fetch user journey data for Sankey diagram visualization
 * 
 * This returns complete user journeys grouped by frequency,
 * showing the exact paths users take through a site.
 * maxSteps is the number of steps in the journey (e.g., maxSteps=3 shows A→B→C)
 */
export async function fetchUserJourneyAction(
  dashboardId: string, 
  startDate: Date, 
  endDate: Date, 
  maxSteps: number = 3,
  limit: number = 50,
  queryFilters: QueryFilter[]
): Promise<SankeyData> {
  const ctx = await usingAuthContext(dashboardId);
  return getUserJourneyForSankeyDiagram(ctx.siteId, startDate, endDate, maxSteps, limit, queryFilters);
}
