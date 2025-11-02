import { z } from "zod";

export const feedbackSchema = z.object({
  message: z
    .string({
      required_error: "Validator: message is required",
      invalid_type_error: "Validator: message must be a string",
    })
    .trim()
    .min(10, "Validator: message must be at least 10 characters long")
    .max(500, "Validator: message must be at most 500 characters long"),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
