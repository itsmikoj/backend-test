import { z } from "zod";

export const appLogSchema = z.object({
  app_version: z
    .string({
      required_error: "Validator: app_version is required",
      invalid_type_error: "Validator: app_version must be a string",
    })
    .trim()
    .optional(),
  user: z
    .string({
      required_error: "Validator: user is required",
      invalid_type_error: "Validator: user must be a string",
    })
    .trim()
    .optional(),
  device: z
    .string({
      required_error: "Validator: device is required",
      invalid_type_error: "Validator: device must be a string",
    })
    .trim()
    .optional(),
  superwall: z
    .string({
      required_error: "Validator: superwall is required",
      invalid_type_error: "Validator: superwall must be a string",
    })
    .trim()
    .optional(),
});

export type AppLogInput = z.infer<typeof appLogSchema>;
