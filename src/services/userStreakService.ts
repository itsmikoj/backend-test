import { supabase } from "../utils/supabaseClient";
import { UserStreak } from "../types/supabase";
import { GlobalResponse } from "../models/globalResponseModel";

export const createUserStreakService = async (
  userId: string,
  createdDate: string,
  timezone: string | null
): Promise<GlobalResponse> => {
  const { data, error } = await supabase
    .from("user_streaks")
    .insert({
      user_id: userId,
      last_completed_date: createdDate,
      current_streak: 1,
      longest_streak: 1,
      remaining_lives: 3,
      last_lives_reset: createdDate,
      timezone,
    })
    .select()
    .single();

  if (error)
    return {
      ok: false,
      message: "User streak creation failed",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.message ?? "Unknown error",
    };

  return {
    ok: true,
    message: "User streak created successfully",
    data: data as UserStreak,
    dateTime: new Date().toISOString(),
    detail: "User streak created successfully",
  };
};

export const getUserStreakByUserId = async (
  userId: string
): Promise<UserStreak | null> => {
  const { data, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log("error in getUserStreakByUserId", error);
    return null;
  }

  return data as UserStreak;
};

export const updateUserStreak = async (
  userId: string,
  updateData: Partial<UserStreak>
): Promise<UserStreak> => {
  const { data, error } = await supabase
    .from("user_streaks")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.log("error in updateUserStreak", error);
    throw error;
  }

  return data as UserStreak;
};

export const updateTimezone = async (timezone: string, userId: string) => {
  const { data, error } = await supabase
    .from("user_streaks")
    .update({
      timezone,
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.log("error in updateTimezone", error);
    throw "Error updating timezone";
  }

  return data as UserStreak;
};
