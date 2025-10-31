import { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient";
import {
  LoginInput,
  RegisterInput,
  UpdateInput,
} from "../validators/auth/authValidator";
import {
  registerUserService,
  refreshTokenService,
  loginUserService,
  updateUserService,
  deleteUserService,
} from "../services/authService";

export const registerUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body as RegisterInput;

    const user = await registerUserService(body);

    res.status(201).json({
      ok: true,
      message: "User created successfully",
      data: user,
      dateTime: new Date().toISOString(),
      detail: "Returned newly created user",
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error creating user",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

export const loginUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body as LoginInput;

    const user = await loginUserService(body);

    res.status(200).json({
      ok: true,
      message: "User logged in successfully",
      data: user,
      dateTime: new Date().toISOString(),
      detail: "Returned user login information",
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error logging in user",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;
  const response = await refreshTokenService(refreshToken);

  if (response.ok) {
    res.status(200).json(response);
  } else {
    res.status(401).json(response);
  }
};

export const validateTokenController = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(400).json({ valid: false, message: "token required" });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    res.status(200).json({ valid: false, message: "token invalid or expired" });
    return;
  }

  res.status(200).json({ valid: true, message: "token valid" });
};

export const updateUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user!;
    const email: string = req.user?.email || "";
    const body = req.body as UpdateInput;

    const updatedUser = await updateUserService(user.id, email, body);

    res.status(200).json({
      ok: true,
      message: "User updated successfully",
      data: updatedUser,
      dateTime: new Date().toISOString(),
      detail: "Returned updated user information",
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error updating user",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = req.user!;

    await deleteUserService(user.id);

    res.status(200).json({
      ok: true,
      message: "Profile deleted successfully",
      data: null,
      dateTime: new Date().toISOString(),
      detail: "Profile deleted",
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Error deleting profile",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error.message,
    });
  }
};
