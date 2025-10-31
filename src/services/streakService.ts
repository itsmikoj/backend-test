import dayjs from "../config/dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

import {
  createUserStreakService,
  getUserStreakByUserId,
  updateTimezone,
  updateUserStreak,
} from "./userStreakService";
import { UserStreak } from "../types/supabase";
import { GlobalResponse } from "../models/globalResponseModel";
import { createResponse } from "../utils/globalResponse";
import { createStreakActivityService } from "./streakActivityService";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(tz);

//  Función para recalcular vidas y racha automáticamente
/*const recalculateStreak = (streak: UserStreak) => {
  const userTZ = streak.timezone || "UTC";

  const todayUserTZ = dayjs().tz(userTZ).startOf("day");
  const lastUpdateUserTZ = dayjs(streak.updated_at).tz(userTZ).startOf("day");

  const diffDays = todayUserTZ.diff(lastUpdateUserTZ, "day");

  let { current_streak, longest_streak, remaining_lives } = streak;

  if (diffDays >= 2) {
    remaining_lives -= diffDays - 1;

    const new_longest_streak = Math.max(longest_streak, current_streak);

    if (remaining_lives <= 0) {
      // Reinicia racha
      current_streak = 0;
      remaining_lives = 0;
    }

    return {
      current_streak,
      longest_streak: new_longest_streak,
      remaining_lives,
      changed: true,
    };
  }

  return { ...streak, changed: false };
}; */

// Funcion para reiniciar el contador si no completo el dia de ayer
const recalculateStreakForDay = (streak: UserStreak) => {
  const userTZ = streak.timezone || "UTC";

  const todayUserTZ = dayjs().tz(userTZ).startOf("day");
  const lastUpdateUserTZ = dayjs(streak.updated_at).tz(userTZ).startOf("day");

  const diffDays = todayUserTZ.diff(lastUpdateUserTZ, "day");

  if (diffDays >= 2) {
    return {
      changed: true,
      current_streak: 0,
    };
  }

  return {
    changed: false,
    current_streak: streak.current_streak,
  };
};

// Obtener racha y recalcular si es necesario
export const getUserStreakInfoService = async (userId: string) => {
  try {
    const userStreak = await getUserStreakByUserId(userId);

    if (!userStreak)
      return createResponse({
        message: "User streak not found",
        data: null,
        detail: "User streak not found",
        statusCode: 404,
      });

    // Logic to recalculate streak if needed
    const updatedStreak_ = recalculateStreakForDay(userStreak);

    if (updatedStreak_.changed) {
      const updatedStreak = await updateUserStreak(userId, {
        current_streak: updatedStreak_.current_streak,
      });
      return createResponse({
        message: "User streak updated",
        data: updatedStreak,
        detail: "User streak updated",
      });
    }

    return createResponse({
      message: "User streak not changed",
      data: userStreak,
      detail: "User streak not changed",
    });
  } catch (error: any) {
    return createResponse({
      message: "Error processing user streak",
      data: null,
      detail: error?.message ?? "Unknown error",
      statusCode: 500,
    });
  }
};

export const extendStreakService = async ({
  userId,
  userStreak,
  timezone: timezone_,
}: {
  userId: string;
  userStreak: UserStreak;
  timezone: string | undefined;
}) => {
  try {
    const timezone = timezone_ || "UTC";

    if (!userStreak.timezone && timezone_ !== undefined) {
      await updateTimezone(timezone, userId);
    }

    const userTZ = userStreak.timezone || timezone;

    const todayUserTZ = dayjs().tz(userTZ).format("YYYY-MM-DD");
    const lastUpdateUserTZ = dayjs(userStreak.last_completed_date).format(
      "YYYY-MM-DD"
    );

    console.log({
      todayUserTZ,
      lastUpdateUserTZ,
      last_completed_date: userStreak.last_completed_date,
    });

    if (todayUserTZ === lastUpdateUserTZ) {
      return createResponse({
        message: "User completed today's streak",
        data: userStreak,
        detail: "User completed today's streak",
        statusCode: 403,
      });
    }

    const newCurrentStreak = userStreak.current_streak + 1;

    const updatedStreak = await updateUserStreak(userId, {
      current_streak: newCurrentStreak,
      last_completed_date: todayUserTZ,
      // remaining_lives:
      //   userStreak.remaining_lives === 0 ? 3 : userStreak.remaining_lives,
    });

    const userActivity = await createStreakActivityService(userId, todayUserTZ);

    if (!userActivity.ok) throw new Error("User activity creation failed");

    return createResponse({
      message: "User streak updated",
      data: {
        userStreak: updatedStreak,
        streakActivity: userActivity,
      },
      detail: "User streak updated",
    });
  } catch (error: any) {
    return createResponse({
      message: "Failed to update user streak",
      data: null,
      detail: error?.message ?? "Unknown error",
      statusCode: 500,
    });
  }
};

export const initializeStreak = async (
  userId: string,
  timezone_: string | undefined
): Promise<GlobalResponse> => {
  try {
    const timezone = timezone_ || "UTC";

    const today = dayjs().tz(timezone).format("YYYY-MM-DD");

    const newUserStreak = await createUserStreakService(
      userId,
      today,
      timezone === "UTC" ? null : timezone
    );

    if (!newUserStreak.ok) throw new Error("User streak creation failed");

    const userActivity = await createStreakActivityService(userId, today);

    if (!userActivity.ok) throw new Error("User activity creation failed");

    return {
      ok: true,
      message: "User streak and activity created successfully",
      data: {
        userStreak: newUserStreak.data,
        streakActivity: userActivity.data,
      },
      dateTime: new Date().toISOString(),
      detail: "User streak and activity created successfully",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: "initialize streak failed",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.message ?? "Unknown error",
    };
  }
};
