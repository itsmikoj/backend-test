import { Status } from "../types/status.enum";
import { FriendWithStreak, Profile } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";
import {
  createFriendsRequestService,
  getFriendRequestByIdService,
  updateStatusFriendRequestService,
} from "./friend_request.service";
import { getProfileService } from "./profileService";

export const getFriendByFullNameOrUsernameService = async (name: string) => {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .or(`full_name.ilike.%${name}%,username.ilike.%${name}%`);

  if (error) {
    throw new Error("DB: " + error.message);
  }

  return data as Profile[];
};

export const getAllFriendsWithStreakService = async (userId: string) => {
  const { data, error } = await supabase
    .from("friends_with_streaks")
    .select("*")
    .eq("user_id", userId)
    .order("current_streak", { ascending: false });

  if (error) {
    throw new Error("DB getAllFriendWithStreakService: " + error.message);
  }

  return data as FriendWithStreak[];
};

export const createFriendRequestService = async (
  senderId: string,
  receiverId: string
) => {
  // 1. No enviarse a sí mismo
  if (senderId === receiverId) {
    throw new Error("You cannot send a friend request to yourself");
  }

  // 2. Receptor existe
  await getProfileService(receiverId);

  // 3. Ya son amigos
  const existingFriend = await getRelationFriends(senderId, receiverId);
  console.log("Existing friend", existingFriend);
  if (existingFriend) throw new Error("Friend already exists");

  // 4. Ya existe solicitud pendiente
  const existingRequest = await getFriendRequest(senderId, receiverId);
  console.log("Existing request", existingRequest);
  if (existingRequest) throw new Error("Ya existe una solicitud pendiente");

  // return existingRequest;

  // 5. Insertar nueva solicitud
  const { data, error } = await supabase
    .from("friend_requests")
    .insert({ sender_id: senderId, receiver_id: receiverId })
    .select("*");

  if (error) throw new Error("DB: " + error.message);

  return data;
};

const getRelationFriends = async (userId: string, friendId: string) => {
  const { data, error } = await supabase
    .from("friends")
    .select("*")
    .eq("user_id", userId)
    .eq("friend_id", friendId)
    .maybeSingle();

  // if (error) throw new Error("DB getRelationFriends: " + error.message);

  return data;
};

const getFriendRequest = async (senderId: string, receiverId: string) => {
  const { data: existingRequest, error } = await supabase
    .from("friend_requests")
    .select("*")
    .or(
      `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
    )
    .eq("status", "pending")
    .maybeSingle();

  if (error) throw new Error("DB getFriendRequest: " + error.message);

  return existingRequest;
};

export const processFriendRequestService = async ({
  id_friend_request,
  status,
  user_id,
}: {
  id_friend_request: string;
  status: Status.ACCEPTED | Status.REJECTED;
  user_id: string;
}) => {
  // 1. Verificar si existe una solicitud pendiente
  const friendRequest = await getFriendRequestByIdService(id_friend_request);

  // 2. Verificar si el usuario es el receptor
  if (friendRequest.receiver_id !== user_id)
    throw new Error("You are not the receiver of this friend request");

  // 3. Validar el estado de la solicitud
  if (
    friendRequest.status !== Status.PENDING ||
    friendRequest.accepted_at !== null ||
    friendRequest.rejected_at !== null
  )
    throw new Error("This friend request is already accepted or rejected");

  // 4. Actualizar el estado de la solicitud
  const updatedFriendRequest = await updateStatusFriendRequestService(
    id_friend_request,
    status
  );

  if (updatedFriendRequest.status === Status.REJECTED)
    return {
      message: "Friend request rejected",
      data: updatedFriendRequest,
    };

  // 5. Crear registro de amistad
  const friends = await createFriendsRequestService(
    updatedFriendRequest.sender_id,
    updatedFriendRequest.receiver_id
  );

  return {
    message: "Friend request processed successfully",
    data: friends,
  };
};
