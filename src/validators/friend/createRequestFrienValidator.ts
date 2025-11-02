import z from "zod";

export const createRequestFriendSchema = z.object({
  profileId: z.string().uuid({
    message: "friendId must be a valid UUID",
  }),
});

export type CreateRequestFriendDTO = z.infer<typeof createRequestFriendSchema>;
