import z from "zod";
import { Status } from "../../types/status.enum";

export const processRequestFriendSchema = z.object({
  id_friend_request: z.string().uuid({
    message: "id_friend_request must be a valid UUID",
  }),
  status: z.enum([Status.ACCEPTED, Status.REJECTED]),
});

export type ProcessRequestFriendDTO = z.infer<
  typeof processRequestFriendSchema
>;
