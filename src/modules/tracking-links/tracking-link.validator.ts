import { z } from "zod";

export const createTrackingLinkSchema = z.object({
  campaign_id: z.string().optional(),
  adset_id: z.string().optional(),
  ad_id: z.string().optional(),
  link_name: z.string().min(1, "Link name is required"),
  custom_params: z.record(z.any()).optional(),
});

export type CreateTrackingLinkDto = z.infer<typeof createTrackingLinkSchema>;