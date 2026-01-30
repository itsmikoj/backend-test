import { z } from "zod";

const deviceInfoSchema = z.object({
  platform: z.string(),
  os_version: z.string(),
  app_version: z.string(),
  device_model: z.string(),
  device_id: z.string(),
  locale: z.string().optional(),
});

export const trackEventSchema = z.object({
  app_id: z.string().min(1),
  session_id: z.string().min(1),
  event_name: z.string().min(1),
  event_data: z.record(z.any()).optional(),
  revenue: z.number().optional(),
  currency: z.string().optional(),
  timestamp: z.string().datetime(),
  device_info: deviceInfoSchema.optional(),
});

export const batchEventsSchema = z.object({
  events: z.array(trackEventSchema),
});
