"use server";

import { fetchVisitorsByGeography } from "@/services/geography";
import { z } from "zod";
import { GeoVisitorSchema } from "@/entities/geography";
import { QueryFilterSchema } from "@/entities/filter";
import { withDashboardAuthContext } from "@/auth/auth-actions";
import { AuthContext } from "@/entities/authContext";

// Schema for validating the input parameters
const queryParamsSchema = z.object({
  siteId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  queryFilters: QueryFilterSchema.array(),
});

const worldMapResponseSchema = z.object({
  visitorData: z.array(GeoVisitorSchema),
  maxVisitors: z.number(),
});

/**
 * Server action to fetch geographic visitor data
 */
export const getWorldMapData = withDashboardAuthContext(
  async (
    ctx: AuthContext,
    params: Omit<z.infer<typeof queryParamsSchema>, "siteId">
  ): Promise<z.infer<typeof worldMapResponseSchema>> => {
    const validatedParams = queryParamsSchema.safeParse({
      ...params,
      siteId: ctx.siteId,
    });

    if (!validatedParams.success) {
      throw new Error(`Invalid parameters: ${validatedParams.error.message}`);
    }

    const { siteId, startDate, endDate, queryFilters } = validatedParams.data;

    try {
      const geoVisitors = await fetchVisitorsByGeography(
        siteId,
        startDate,
        endDate,
        queryFilters
      );

      const maxVisitors = Math.max(...geoVisitors.map((d) => d.visitors), 1);

      return worldMapResponseSchema.parse({
        visitorData: geoVisitors,
        maxVisitors,
      });
    } catch (error) {
      console.error("Error fetching visitor map data:", error);
      throw new Error("Failed to fetch visitor map data");
    }
  }
);
