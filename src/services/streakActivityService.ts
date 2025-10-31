import { supabase } from "../utils/supabaseClient";
import { formatWeekStreak } from "../utils/streak/formatWeekStreak";
import { type StreakActivity } from "../types/supabase";
import { createResponse, type GlobalResponse } from "../utils/globalResponse";
import { getStartOfWeek } from "../utils/streak/dates";
import { streakTodayInput } from "../validators/streak/streakValidator";
import { parseISO, startOfMonth, format } from "date-fns";

export const createStreakActivityService = async (
  userId: string,
  completedAt: string
): Promise<GlobalResponse<StreakActivity | null>> => {
  const { data, error } = await supabase
    .from("streak_activity")
    .insert({
      user_id: userId,
      completed_at: completedAt,
    })
    .select()
    .single();

  if (error)
    return createResponse({
      message: "Streak activity creation failed",
      data: null,
      detail: error?.message ?? "Unknown error",
      statusCode: 500,
    });

  return createResponse({
    message: "Streak activity created successfully",
    data: data as StreakActivity,
    detail: "Streak activity created successfully",
  });
};

export const getAllStreakActivityByUserId = async (
  userId: string
): Promise<GlobalResponse<StreakActivity[]>> => {
  const { data, error } = await supabase
    .from("streak_activity")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error)
    return createResponse({
      message: "Streak activity retrieval failed",
      data: [],
      detail: error?.message ?? "Unknown error",
      statusCode: 500,
    });

  return createResponse({
    message: "Streak activity retrieved successfully",
    data: data as StreakActivity[],
    detail: "Streak activity retrieved successfully",
  });
};

export const getStreakActivityByUserIdAndCompletedAt = async (
  userId: string,
  completedAt: string
): Promise<GlobalResponse<StreakActivity[] | null>> => {
  const { data, error } = await supabase
    .from("streak_activity")
    .select("*")
    .eq("user_id", userId)
    .eq("completed_at", completedAt);

  if (error) {
    return createResponse({
      message: "Error retrieving user's prayed today",
      data: null,
      detail: error?.message ?? "Unknown error",
      statusCode: 500,
    });
  }

  if (data.length === 0) {
    return createResponse({
      message: "Not found user's prayed today",
      data: null,
      detail: "Not found user's prayed today",
      statusCode: 404,
    });
  }

  return createResponse({
    message: "Found user's prayed today",
    data: data as StreakActivity[],
    detail: "Streak activity retrieved successfully",
  });
};

export const getStreakOfWeekService = async (
  id: string,
  body: streakTodayInput
): Promise<Record<string, [string, string]>> => {
  const todayString = body.today;

  const { data, error } = await supabase
    .from("streak_activity")
    .select("completed_at")
    .eq("user_id", id)
    .gte("completed_at", getStartOfWeek(todayString))
    .lte("completed_at", todayString);

  if (error) {
    throw new Error("DB: " + error.message);
  }

  const completedDates = new Set(data.map((item) => item.completed_at));

  return formatWeekStreak(completedDates, todayString);
};

export const getStreakOfMonthService = async (
  id: string,
  body: streakTodayInput
): Promise<number> => {
  const todayString = body.today;
  const today = parseISO(todayString);

  const startOfMonthDate = startOfMonth(today);
  const startOfMonthString = format(startOfMonthDate, "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("streak_activity")
    .select("completed_at")
    .eq("user_id", id)
    .gte("completed_at", startOfMonthString)
    .lte("completed_at", todayString);

  if (error) {
    throw new Error("DB: " + error.message);
  }

  return data.length;
};

export const getDaysPracticedService = async (
  userId: string
): Promise<number> => {
  const { data, error } = await supabase
    .from("streak_activity")
    .select("completed_at", { count: "exact" })
    .eq("user_id", userId);

  if (error) {
    throw new Error("DB: " + error.message);
  }

  return data.length;
};
