import { z } from "zod";

export const onboardingSchema = z.object({
  prayer_weekly: z.string().nullable().optional(),
  age: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  about: z.string().nullable().optional(),
  use_app_related: z.string().nullable().optional(),
  goal: z.string().nullable().optional(),
  consistency: z.string().nullable().optional(),
  reaching_goal: z.string().nullable().optional(),
  spiritual_practice: z.string().nullable().optional(),
  accomplish: z.string().nullable().optional(),
  denomination: z.string().nullable().optional(),
  times_talk: z.number().nullable().optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;