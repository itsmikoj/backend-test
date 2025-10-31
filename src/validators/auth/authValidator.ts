import { z } from "zod";

export const registerSchema = z.object({
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
});

export const loginSchema = z.object({
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

export const updateSchema = z.object({
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

  method: z.enum(["email", "apple"], {
    required_error: "Validator: method is required",
    invalid_type_error: "Validator: method must be one of 'email' or 'apple'",
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
