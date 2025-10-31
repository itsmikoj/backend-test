import { z } from "zod";

export const aiRequestErrorsSchema = z.object({
  request_payload: z.string({
    required_error: "Validator: request_payload is required",
    invalid_type_error: "Validator: request_payload must be a string",
  }),

  status_code: z.string({
    required_error: "Validator: status_code is required",
    invalid_type_error: "Validator: status_code must be a string",
  }),

  endpoint: z.string({
    required_error: "Validator: endpoint is required",
    invalid_type_error: "Validator: endpoint must be a string",
  }),
});

export type AiRequestErrorsInput = z.infer<typeof aiRequestErrorsSchema>;
