import { z } from "zod";

export const DeviceTypeSchema = z.object({
  device_type: z.string(),
  visitors: z.number(),
});

export const BrowserInfoSchema = z.object({
  browser: z.string(),
  visitors: z.number(),
});

export const BrowserStatsSchema = z.object({
    browser: z.string(),
  visitors: z.number(),
  percentage: z.number(),
});


export const DeviceSummarySchema = z.object({
    distinctDeviceCount: z.number(),
    topDevice: z.object({
        name: z.string(),
        visitors: z.number(),
    percentage: z.number(),
}),
});

export type BrowserInfo = z.infer<typeof BrowserInfoSchema>;
export type BrowserStats = z.infer<typeof BrowserStatsSchema>;
export type DeviceType = z.infer<typeof DeviceTypeSchema>;
export type DeviceSummary = z.infer<typeof DeviceSummarySchema>; 