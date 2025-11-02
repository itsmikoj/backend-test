import { Request, Response } from "express";
import {
  StreakActivityDTO,
  UpdateStreakDTO,
} from "../validators/dateStringValidator";
import { getUserStreakByUserId } from "../services/userStreakService";
import { streakTodayInput } from "../validators/streak/streakValidator";
import {
  extendStreakService,
  getUserStreakInfoService,
  initializeStreak,
} from "../services/streakService";
import {
  getAllStreakActivityByUserId,
  getStreakActivityByUserIdAndCompletedAt,
  getStreakOfWeekService,
  getStreakOfMonthService,
  getDaysPracticedService,
} from "../services/streakActivityService";

export const getStreakInfoController = async (req: Request, res: Response) => {
  const streakInfo = await getUserStreakInfoService(req.user!.id);

  res.status(streakInfo.statusCode).json(streakInfo);
};

export const updateStreakController = async (req: Request, res: Response) => {
  const user = req.user!;
  const body = req.body as UpdateStreakDTO;

  console.log("body", body);

  const userStreak = await getUserStreakByUserId(user.id);

  // If user streak is not found, create a new user streak and streak activity
  if (!userStreak) {
    const resp = await initializeStreak(user.id, body?.timezone);
    res.status(resp.ok ? 200 : 409).json(resp);
    return;
  }

  // If user has prayed today, return the response
  // const prayedToday = await getStreakActivityByUserIdAndCompletedAt(
  //   user.id,
  //   completedAt
  // );

  // if (prayedToday.data) {
  //   res.status(403).json({ message: "User completed today's streak" });
  //   return;
  // }

  const resp = await extendStreakService({
    userId: user.id,
    userStreak: userStreak,
    timezone: body?.timezone,
  });

  res.status(resp.statusCode).json(resp);
};

export const getStreakActivityController = async (
  req: Request,
  res: Response
) => {
  const streakActivity = await getAllStreakActivityByUserId(req.user!.id);

  res.status(streakActivity.statusCode).json(streakActivity);
};

export const getHasPrayedTodayController = async (
  req: Request,
  res: Response
) => {
  const { completedAt } = req.body as StreakActivityDTO;

  const streakActivity = await getStreakActivityByUserIdAndCompletedAt(
    req.user!.id,
    completedAt
  );

  res.status(streakActivity.statusCode).json(streakActivity);
};

export const getStreakOfWeekController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = req.user!;
    const body = req.body as streakTodayInput;

    const streakActivity = await getStreakOfWeekService(user.id, body);

    res.status(200).json({
      ok: true,
      message: "Weekly streak days fetched successfully",
      data: streakActivity,
      dateTime: new Date().toISOString(),
      detail: "Returned weekly streak days",
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error fetching weekly streak days",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

export const getStreakOfMonthController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = req.user!;
    const body = req.body as streakTodayInput;

    const streakActivity = await getStreakOfMonthService(user.id, body);

    res.status(200).json({
      ok: true,
      message: "Monthly streak progress fetched successfully",
      data: streakActivity,
      dateTime: new Date().toISOString(),
      detail: "Returned monthly streak progress",
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error fetching monthly streak progress",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

export const getDaysPracticedController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = req.user!;
    const daysPracticed = await getDaysPracticedService(user.id);

    res.status(200).json({
      ok: true,
      message: "Days practiced fetched successfully",
      data: daysPracticed,
      dateTime: new Date().toISOString(),
      detail: "Returned days practiced",
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error fetching days practiced",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};
