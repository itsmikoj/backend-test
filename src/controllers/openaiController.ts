import { Request, Response } from "express";
import { PrayerInput } from "../validators/openai/openaiValidator";
import {
  getCitationService,
  createPrayerService,
} from "../services/openaiService";

export const citationController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const citation = await getCitationService();

    res.status(200).json({
      ok: true,
      message: "Citation fetched successfully",
      citation: citation.phrase.en,
      citationES: citation.phrase.es,
      updatedAt: citation.updated_at,
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error fetching citation",
      citation: null,
      updatedAt: null,
    });
  }
};

export const prayerController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const body = req.body as PrayerInput;

    const prayer = await createPrayerService(body.answer, body.lang);

    res.status(200).json({
      ok: true,
      message: "Prayer generated successfully",
      prayer: prayer,
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error generating prayer",
      prayer: null,
    });
  }
};
