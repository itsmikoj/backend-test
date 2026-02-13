import { z } from "zod";

export const installPathParamSchema = z.object({
  app_tracker_id: z
    .string({
      message: "Validator: app_tracker_id must be a string",
    })
    .uuid({
      message: "Validator: app_tracker_id must be a valid UUID",
    }),
});

export type InstallPathParamDto = z.infer<typeof installPathParamSchema>;
