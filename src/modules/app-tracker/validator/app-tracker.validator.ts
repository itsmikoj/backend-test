import { z } from "zod";

export const appTrackerSchema = z.object({
  app_name: z.string().min(1, "App name is required"),
  bundle_id: z.string().min(1, "Bundle ID is required"),
  app_store_url: z.string().url("Must be a valid URL"), 
  play_store_url: z.string().url("Must be a valid URL").optional(), 
  deep_link_scheme: z.string().optional(), 
  fallback_url: z.string().url("Must be a valid URL").optional(), 
});

export type AppTrackerDto = z.infer<typeof appTrackerSchema>;