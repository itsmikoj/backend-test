import z from "zod";

export const appleLoginSchema = z.object({
  identityToken: z.string({
    required_error: "Validator: identityToken is required",
    invalid_type_error: "Validator: identityToken must be a string",
  }),

  full_name: z
    .string({
      required_error: "Validator: full_name is required",
      invalid_type_error: "Validator: full_name must be a string",
    })
    .trim()
    .min(5, "Validator: full_name must be at least 5 characters"),
});

export type AppleLoginInput = z.infer<typeof appleLoginSchema>;
