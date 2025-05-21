import { z } from "zod";

const envSchema = z.object({
  CLICKHOUSE_URL: z.string().url(),
  CLICKHOUSE_USER: z.string().min(1),
  CLICKHOUSE_PASSWORD: z.string().min(1),
  ADMIN_EMAIL: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  SITE_ID: z.string().min(1),
});

export const env = envSchema.parse(process.env); 