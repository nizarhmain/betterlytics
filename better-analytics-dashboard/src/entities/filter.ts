import { z } from "zod";

const FILTER_KINDS = [
  "url",
  "device_type",
  "country_code",
  "browser",
  "os",
  "referrer_source",
  "referrer_source_name",
  "referrer_search_term",
  "referrer_url",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "event_type",
  "custom_event_name"
] as const;

const FILTER_OPERATORS = [
  "is",
  "is-not"
] as const;

export const QueryFilterSchema = z.object({
  kind: z.enum(FILTER_KINDS),
  operator: z.enum(FILTER_OPERATORS),
  value: z.string()
});

export type QueryFilter = z.infer<typeof QueryFilterSchema>;
