import { z } from "zod";

export const dateValidatorSchema = z.object({
  date: z.string({
    message: "Date must be in format YYYY-MM-DD",
  }),
  // .regex(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: "Date must be in format YYYY-MM-DD",
  // }),
});
