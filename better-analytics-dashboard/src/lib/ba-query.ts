import { GranularityRangeValues } from "@/utils/granularityRanges";
import { z } from "zod";

// Utility for granularity
const GranularitySchema = z.enum(["toStartOfDay", "toStartOfHour", "toStartOfMinute"]);
const granularityMapper = {
  "day": GranularitySchema.enum.toStartOfDay,
  "hour": GranularitySchema.enum.toStartOfHour,
  "minute": GranularitySchema.enum.toStartOfMinute,
} as const;

/**
 * Returns SQL function to be used for granularity.
 * This will throw an exception if parameter is illegal
 */
function getGranularitySQLFunctionFromGranularityRange(granularity: GranularityRangeValues) {
  const mappedGranularity = granularityMapper[granularity];
  return GranularitySchema.parse(mappedGranularity);
}

export const BAQuery = {
  getGranularitySQLFunctionFromGranularityRange
}
