import { Status } from "../types/status.enum";
import { Friend, FriendRequest } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";

export const getFriendRequestByIdService = async (id: string) => {
  const { data, error } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error("DB: " + error.message);

  return data as FriendRequest;
};

export const getPendingFriendRequestByReceiverIdService = async (
  userId: string
) => {
  const { data } = await supabase
    .from("friend_requests")
    .select(
      "id, sender_id, receiver_id, created_at, status, sender:friend_requests_sender_id_fkey (username, full_name)"
    )
    .eq("receiver_id", userId)
    .eq("status", Status.PENDING)
    .order("created_at", { ascending: false })
    .throwOnError();

  return data;
};

export const updateStatusFriendRequestService = async (
  id_friend_request: string,
  status: Status.ACCEPTED | Status.REJECTED
) => {
  const { data, error } = await supabase
    .from("friend_requests")
    .update({
      status,
      rejected_at: status === Status.REJECTED ? new Date().toISOString() : null,
      accepted_at: status === Status.ACCEPTED ? new Date().toISOString() : null,
    })
    .eq("id", id_friend_request)
    .select("*")
    .maybeSingle();

  if (error)
    throw new Error("DB updateStatusFriendRequestService: " + error.message);

  return data as FriendRequest;
};

export const createFriendsRequestService = async (
  senderId: string,
  receiverId: string
) => {
  const { data, error } = await supabase
    .from("friends")
    .insert([
      { user_id: senderId, friend_id: receiverId },
      { user_id: receiverId, friend_id: senderId },
    ])
    .select("*");

  if (error)
    throw new Error("DB createFriendsRequestService: " + error.message);

  return data as FriendRequest[];
};

export const getAllFriendsService = async (userId: string) => {
  const { data } = await supabase
    .from("friends")
    .select("friend_id, friend:friends_friend_id_fkey (username, full_name)")
    .eq("user_id", userId)
    .throwOnError();

  return data;
};
