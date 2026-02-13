import { z } from "zod";

const appSchema = z.object({
  bundle_id: z.string({ message: "Validator: bundle_id must be a string" }),
  version: z.string({ message: "Validator: version must be a string" }),
  build: z.string({ message: "Validator: build must be a string" }),
});

const deviceSchema = z.object({
  idfv: z.string({ message: "Validator: idfv must be a string" }),
  os_version: z.string({ message: "Validator: os_version must be a string" }),
  locale: z.string({ message: "Validator: locale must be a string" }),
  model: z.string({ message: "Validator: model must be a string" }),
  timezone: z.string({ message: "Validator: timezone must be a string" }),
  idfa: z.string({ message: "Validator: idfa must be a string" }),
});

export const installSchema = z.object({
  app_tracker_id: z.string({
    required_error: "Validator: user_id is required",
    invalid_type_error: "Validator: user_id must be a string",
  }),
  event_id: z.string({
    required_error: "Validator: event_id is required",
    invalid_type_error: "Validator: event_id must be a string",
  }),
  timestamp: z.number({ message: "Validator: timestamp must be a number" }),
  platform: z.string({ message: "Validator: platform must be a string" }),
  event_name: z.string({ message: "Validator: event_name must be a string" }),
  privacy: z.object({
    att_status: z.number({ message: "Validator: att_status must be a number" }),
  }),
  app: appSchema,
  device: deviceSchema,
});

export type InstallDto = z.infer<typeof installSchema>;
