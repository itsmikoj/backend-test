import { z } from "zod";

export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export const streamingSchema = z.object({
  messages: z
    .array(
      z.object({
        content: z.string().nonempty("Message content is required"),
        role: z.enum([Role.USER, Role.ASSISTANT, Role.SYSTEM]),
      })
    )
    .min(1, "Default message is required"),
});

export type StreamingDTO = z.infer<typeof streamingSchema>;
