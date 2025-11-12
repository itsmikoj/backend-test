import { z } from "zod";

export const postRegisterSchema = z.object({
  email: z
    .string({
      required_error: "Validator: email is required",
      invalid_type_error: "Validator: email must be a string",
    })
    .trim()
    .email("Validator: email must be a valid email address")
    .toLowerCase(),

  password: z
    .string({
      required_error: "Validator: password is required",
      invalid_type_error: "Validator: password must be a string",
    })
    .min(6, "Validator: password must be at least 6 characters")
    .max(64, "Validator: password must be less than 64 characters"),

  full_name: z
    .string({
      required_error: "Validator: full_name is required",
      invalid_type_error: "Validator: full_name must be a string",
    })
    .trim()
    .min(5, "Validator: full_name must be at least 5 characters")
    .max(50, "Validator: full_name must be less than 50 characters")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/, {
      message: "Validator: full_name must contain only letters and spaces",
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

export const postLoginSchema = z.object({
  email: z
    .string({
      required_error: "Validator: email is required",
      invalid_type_error: "Validator: email must be a string",
    })
    .trim()
    .email("Validator: email must be a valid email address")
    .toLowerCase(),

  password: z
    .string({
      required_error: "Validator: password is required",
      invalid_type_error: "Validator: password must be a string",
    })
    .min(6, "Validator: password must be at least 6 characters")
    .max(64, "Validator: password must be less than 64 characters"),
});

export const updateAuthSchema = z.object({
  email: z
    .string({
      required_error: "Validator: email is required",
      invalid_type_error: "Validator: email must be a string",
    })
    .trim()
    .email("Validator: email must be a valid email address")
    .toLowerCase()
    .optional(),

  password: z
    .string({
      required_error: "Validator: password is required",
      invalid_type_error: "Validator: password must be a string",
    })
    .min(6, "Validator: password must be at least 6 characters")
    .max(64, "Validator: password must be less than 64 characters")
    .optional(),

  full_name: z
    .string({
      required_error: "Validator: full_name is required",
      invalid_type_error: "Validator: full_name must be a string",
    })
    .trim()
    .min(5, "Validator: full_name must be at least 5 characters")
    .max(50, "Validator: full_name must be less than 50 characters")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/, {
      message: "Validator: full_name must contain only letters and spaces",
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

  method: z.enum(["email", "apple"], {
    required_error: "Validator: method is required",
    invalid_type_error: "Validator: method must be one of 'email' or 'apple'",
  }),
});

export type PostRegisterInput = z.infer<typeof postRegisterSchema>;
export type PostLoginInput = z.infer<typeof postLoginSchema>;
export type PutAuthInput = z.infer<typeof updateAuthSchema>;
