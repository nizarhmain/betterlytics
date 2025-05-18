"server only";

import { QueryFilter, QueryFilterSchema } from "@/entities/filter";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import { z } from "zod";
import { safeSql, SQL } from "./safe-sql";

/**
 * Build query filters using `safeSql`
 */
function getFilterQuery(queryFilters: QueryFilter[]) {
  const filters = QueryFilterSchema.array().parse(queryFilters);

  const expressions = filters
    .map(({ column, operator, value }, index) => {
      return safeSql`${SQL._Unsafe(column)} ${SQL._Unsafe(operator)} ${SQL.String({ [`query_filter_${index}`]: value })}`
    });

  return safeSql` ${SQL.AND(expressions)} `;
}


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
  getGranularitySQLFunctionFromGranularityRange,
  getFilterQuery
}
