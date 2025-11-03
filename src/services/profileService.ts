import { Profile } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";
import { generateUuidv4 } from "../lib/generateUuidv4";
import {
  mapToPostProfileEntity,
  mapToPutProfileEntity,
} from "../mappers/profileMapper";
import {
  PostProfileInput,
  PutProfileInput,
} from "../validators/profile/profileValidator";

export const getProfileService = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId);

  if (error) {
    throw new Error("DB: " + error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("Profile not found");
  }

  if (data.length > 1) {
    throw new Error("Multiple profiles found for user");
  }

  return data[0] as Profile;
};

export const createProfileService = async (
  id: string,
  body: PostProfileInput
): Promise<Profile> => {
  try {
    const existingProfile = await getProfileService(id);
    return existingProfile;
  } catch (error: any) {
    if (error.message !== "Profile not found") {
      throw new Error(error.message);
    }
  }

  const newProfile = mapToPostProfileEntity(id, body);

  const { data, error } = await supabase
    .from("profile")
    .insert(newProfile)
    .select("full_name, username, is_premium, created_at")
    .single();

  if (error) {
    throw new Error("DB: " + error.message);
  }

  return data as Profile;
};

export const updateProfileService = async (
  id: string,
  body: PutProfileInput
): Promise<Profile> => {
  await getProfileService(id);

  const newProfile = mapToPutProfileEntity(id, body);

  const { data, error } = await supabase
    .from("profile")
    .update(newProfile)
    .eq("id", id)
    .select("full_name, username, is_premium, created_at")
    .single();

  if (error) {
    throw new Error("DB: " + error.message);
  }

  if (!data) {
    throw new Error("Profile not found after update");
  }

  return data as Profile;
};

export const uploadUserPhotoService = async (
  file: Buffer<ArrayBufferLike>,
  userId: string
): Promise<string> => {
  const uuid = generateUuidv4();
  const path = `avatars/${userId}/${uuid}.webp`;

  const { error } = await supabase.storage
    .from("user-images")
    .upload(path, file, {
      contentType: "image/webp",
      upsert: true,
    });

  if (error) throw new Error("Error uploading photo: " + error.message);

  const { data: publicUrlData } = supabase.storage
    .from("user-images")
    .getPublicUrl(path);

  const publicUrl = publicUrlData.publicUrl;

  console.log("Public data:", publicUrlData);

  return publicUrl;
};

export const updatePhotoUrlService = async (
  profileId: string,
  photoUrl: string
): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profile")
    .update({ photo_url: photoUrl })
    .eq("id", profileId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error("DB updatePhotoUrlService: " + error.message);
  }

  if (!data) {
    throw new Error("Profile not found after update");
  }

  return data as Profile;
};

export const checkUsernameService = async (username: string): Promise<boolean> => {
  if (!username?.trim()) {
    throw new Error("Username is required");
  }

  const trimmed = username.trim().toLowerCase();

  const { count, error } = await supabase
    .from("profile")
    .select("*", { count: "exact", head: true })
    .eq("username", trimmed);

  if (error) {
    throw new Error("DB: " + error.message);
  }

  return count === 0;
};

export const updateUsernameService = async (
  userId: string,
  newUsername: string
): Promise<Profile> => {
  if (!newUsername?.trim()) {
    throw new Error("Username is required");
  }

  const trimmed = newUsername.trim().toLowerCase();

  const existingProfile = await getProfileService(userId);

  if (existingProfile.username?.toLowerCase() === trimmed) {
    throw new Error("New username must be different from current username");
  }

  const { data, error } = await supabase
    .from("profile")
    .update({ username: trimmed })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error("DB updateUsernameService: " + error.message);
  }

  if (!data) {
    throw new Error("Profile not found after update");
  }

  return data as Profile;
};
