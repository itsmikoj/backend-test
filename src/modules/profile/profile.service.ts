import { mapToProfileEntity } from "../../mappers/profileMapper";
import { Profile } from "../../types/supabase";
import { supabase } from "../../utils/supabaseClient";
import { ProfileInput } from "../../validators/profile/profileValidator";

export const getProfileService = async (
  userId: string
): Promise<Profile | null> => {
  const { data } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .maybeSingle()
    .throwOnError();

  return data as Profile | null;
};

export const createProfileService = async (
  id: string,
  body: ProfileInput
): Promise<Profile> => {
  const newProfile = mapToProfileEntity({ id, body });

  const { data, error } = await supabase
    .from("profile")
    .insert(newProfile)
    .select("full_name, is_premium, created_at")
    .single();

  if (error) {
    throw new Error("DB: " + error.message);
  }

  return data as Profile;
};

export const updateProfileService = async (
  id: string,
  body: ProfileInput
): Promise<Profile> => {
  await getProfileService(id);

  const newProfile = mapToProfileEntity({ id, body });

  const { data, error } = await supabase
    .from("profile")
    .update(newProfile)
    .eq("id", id)
    .select("full_name, is_premium, created_at")
    .single();

  if (error) {
    throw new Error("DB: " + error.message);
  }

  if (!data) {
    throw new Error("Profile not found after update");
  }

  return data as Profile;
};
