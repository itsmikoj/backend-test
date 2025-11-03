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
  updateUsernameService,
} from "../services/profileService";
import { updateUsernameSchema } from "../validators/profile/usernameValidator";

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

export const updateUsernameController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const validation = updateUsernameSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validation.error.errors,
      });
    }

    const { username } = validation.data;

    const updatedProfile = await updateUsernameService(userId, username);

    return res.status(200).json({
      success: true,
      message: "Username updated successfully",
      data: updatedProfile,
    });
  } catch (error: any) {
    console.error("Error updating username:", error);

    if (error.message === "Username is already taken") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "New username must be different from current username") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Profile not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
