import { z } from "zod";

export const postProfileSchema = z.object({
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
  username: z
    .string({
      required_error: "Validator: username is required",
      invalid_type_error: "Validator: username must be a string",
    })
    .trim()
    .min(5, "Validator: username must be at least 5 characters")
    .max(50, "Validator: username must be less than 20 characters")
    .regex(/^[A-Za-z0-9._-]+$/, {
      message:
        "Validator: username must contain letters, numbers, and special characters (._-)",
    }),
});

export const putProfileSchema = z.object({
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
    })
    .optional(),

  username: z
    .string({
      required_error: "Validator: username is required",
      invalid_type_error: "Validator: username must be a string",
    })
    .trim()
    .min(5, "Validator: username must be at least 5 characters")
    .max(50, "Validator: username must be less than 20 characters")
    .regex(/^[A-Za-z0-9._-]+$/, {
      message:
        "Validator: username must contain letters, numbers, and special characters (._-)",
    })
    .optional(),
});

export type PostProfileInput = z.infer<typeof postProfileSchema>;
export type PutProfileInput = z.infer<typeof putProfileSchema>;
