import { Request, Response } from "express";
import {
  createOnboardingService,
  getOnboardingByUserIdService,
  updateOnboardingService,
} from "../services/onboardingService";

export const createOnboardingController = async (req: Request, res: Response) => {
  const user = req.user!;
  const data = req.body;

  const response = await createOnboardingService(user.id, data);
  res.status(200).json(response);
};

export const getOnboardingController = async (req: Request, res: Response) => {
  const user = req.user!;
  const response = await getOnboardingByUserIdService(user.id);
  res.status(200).json(response);
};

export const updateOnboardingController = async (req: Request, res: Response) => {
  const user = req.user!;
  const data = req.body;

  const response = await updateOnboardingService(user.id, data);
  res.status(200).json(response);
};