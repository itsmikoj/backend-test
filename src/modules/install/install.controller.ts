import { Request, Response } from "express";
import {
  createInstallService,
  getInstallsByAppTrackerIdService,
} from "./install.service";
import { InstallDto } from "./validator/install.validator";
import { findAppTrackerByIdService } from "../app-tracker/app-tracker.service";
import { InstallPathParamDto } from "./validator/install-path-param.validator";

export const createInstallController = async (req: Request, res: Response) => {
  try {
    const body = req.body as InstallDto;

    const appTracker = await findAppTrackerByIdService(body.app_tracker_id);

    if (!appTracker) {
      return res.status(400).json({
        ok: false,
        message: "App tracker not found",
      });
    }

    if (appTracker.bundle_id !== body.app.bundle_id) {
      return res.status(400).json({
        ok: false,
        message: "App tracker and install don't match",
      });
    }

    const install = await createInstallService(appTracker.id, body, req);

    res.status(201).json({
      ok: true,
      data: install,
      message: "Install created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getInstallsByAppTrackerIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user!;
    const params = req.params as InstallPathParamDto;

    const installs = await getInstallsByAppTrackerIdService(
      params.app_tracker_id
    );

    res.status(200).json({
      ok: true,
      message: "Installs fetched successfully",
      data: installs,
    });
  } catch (error: any) {
    const statusCode = error.message === "Installs not found" ? 404 : 500;

    res.status(statusCode).json({
      ok: false,
      message: "Error fetching installs",
    });
  }
};