import { z } from "zod";

export const profileSchema = z.object({
  full_name: z
    .string({
      required_error: "Validator: full_name is required",
      invalid_type_error: "Validator: full_name must be a string",
    })
    .trim()
    .min(5, "Validator: full_name must be at least 5 characters")
    .max(50, "Validator: full_name must be less than 50 characters")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ0-9\s._\-+]+$/, {
      message:
        "Validator: full_name must contain letters, numbers, spaces, and special characters (._-+)",
    }),
});

export type ProfileInput = z.infer<typeof profileSchema>;
