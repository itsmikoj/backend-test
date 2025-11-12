import { Request, Response } from "express";
import { appLogService } from "../services/appLogService";
import { AppLogInput } from "../validators/app_logs/appLogsValidator";

export const appLogController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const body = req.body as AppLogInput;

    const prayer = await appLogService(body);

    res.status(201).json({
      ok: true,
      message: "Log generated successfully",
      prayer: prayer,
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error generating log",
      prayer: null,
    });
  }
};
