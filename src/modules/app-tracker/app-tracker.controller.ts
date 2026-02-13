import { Request, Response } from "express";
import { AppTrackerDto } from "./validator/app-tracker.validator";
import {
  createAppTrackerService,
  getAllAppTrackerServiceByUserId,
  getFindAppTrackerByBundleIdService,
} from "./app-tracker.service";

export const createAppTrackerController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = req.user!;
    const body = req.body as AppTrackerDto;

    const findAppTracker = await getFindAppTrackerByBundleIdService(
      user.id,
      body.bundle_id,
    );

    if (findAppTracker)
      return res.status(400).json({
        ok: false,
        message: "App tracker already exists",
      });

    const newAppTracker = await createAppTrackerService(user.id, body);

    res.status(201).json({
      ok: true,
      data: newAppTracker,
      message: "App tracker created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllAppTrackerController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = req.user!;

    const allAppTracker = await getAllAppTrackerServiceByUserId(user.id);

    res.status(200).json({
      ok: true,
      data: allAppTracker,
      message: "App trackers retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
