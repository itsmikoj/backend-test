import { z } from "zod";

export const streakActivitySchema = z.object({
  completedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in format YYYY-MM-DD",
  }),
});

export type StreakActivityDTO = z.infer<typeof streakActivitySchema>;

export const updateStreakSchema = z.object({
  timezone: z.string().regex(/^[A-Za-z]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)*$/, {
    message: "Formato de zona horaria inválido",
  }),
});

export type UpdateStreakDTO = z.infer<typeof updateStreakSchema>;
