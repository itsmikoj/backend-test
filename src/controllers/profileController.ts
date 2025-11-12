import { Request, Response } from "express";
import {
  PostProfileInput,
  PutProfileInput,
} from "../validators/profile/profileValidator";
import {
  getProfileService,
  createProfileService,
  updateProfileService,
  checkUsernameService,
} from "../services/profileService";

export const getProfileController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = req.user!;

    const profile = await getProfileService(user.id);

    res.status(200).json({
      ok: true,
      message: "Profile fetched successfully",
      data: profile,
      dateTime: new Date().toISOString(),
      detail: "Returned user profile",
    });
  } catch (error: any) {
    const statusCode = error.message === "Profile not found" ? 404 : 500;

    res.status(statusCode).json({
      ok: false,
      message: "Error fetching profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

export const createProfileController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = req.user!;
    const body = req.body as PostProfileInput;

    const profile = await createProfileService(user.id, body);

    return res.status(200).json({
      ok: true,
      message: "Profile created or retrieved successfully",
      data: profile,
      dateTime: new Date().toISOString(),
      detail: "Returned existing or newly created profile",
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error creating profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

export const updateProfileController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = req.user!;
    const body = req.body as PutProfileInput;

    const profile = await updateProfileService(user.id, body);

    res.status(200).json({
      ok: true,
      message: "Profile updated successfully",
      data: profile,
      dateTime: new Date().toISOString(),
      detail: "Returned updated user profile",
    });
  } catch (error: any) {
    const statusCode = error.message === "Profile not found" ? 404 : 500;

    res.status(statusCode).json({
      ok: false,
      message: "Error updating profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

export const checkUsernameController = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Invalid username input",
        data: null,
        dateTime: new Date().toISOString(),
        detail: "Username must be a non-empty string",
      });
    }

    const isAvailable = await checkUsernameService(username);

    return res.status(200).json({
      ok: true,
      message: "Username check completed",
      data: isAvailable,
      dateTime: new Date().toISOString(),
      detail: isAvailable ? "Username available" : "Username already taken",
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: "Error checking username",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

