import axios from "axios";
import dotenv from "dotenv";
import { supabase } from "../utils/supabaseClient";
import { GlobalResponse } from "../models/globalResponseModel";
import { toRefreshTokenDTO } from "../mappers/tokenMapper";
import { Login, Register, Update } from "../types/supabase";
import {
  LoginInput,
  RegisterInput,
  UpdateInput,
} from "../validators/auth/authValidator";
import {
  createProfileService,
  getProfileService,
  updateProfileService,
} from "./profileService";
import {
  mapToLoginDTO,
  mapToRegisterDTO,
  mapToAuthEntity,
  mapToUpdateEntity,
  mapToUpdateDTO,
} from "../mappers/authMapper";

dotenv.config();

export const registerUserService = async (
  body: RegisterInput
): Promise<Register> => {
  const userEntity = mapToAuthEntity(body);

  const { data, error } = await supabase.auth.signUp(userEntity);

  if (error) {
    throw new Error(`DB: ${error.message}`);
  }
  if (!data || !data.user) {
    throw new Error("User registration failed, no user data returned");
  }

  const profile = await createProfileService(data.user.id, body);

  const user = mapToRegisterDTO(data, profile);
  return user as Register;
};

export const loginUserService = async (body: LoginInput): Promise<Login> => {
  const userEntity = mapToAuthEntity(body);

  const { data, error } = await supabase.auth.signInWithPassword(userEntity);

  if (error) {
    throw new Error(`DB: ${error.message}`);
  }
  if (!data || !data.user) {
    throw new Error("Login failed, no user data returned");
  }

  const profile = await getProfileService(data.user.id);

  const user = mapToLoginDTO(data, profile);
  return user as Login;
};

export const refreshTokenService = async (
  refreshToken: string
): Promise<GlobalResponse> => {
  try {
    const response = await axios.post(
      `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
      { refresh_token: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    const token = response.data;
    const refreshTokenDTO = toRefreshTokenDTO(token);

    return {
      ok: true,
      message: "Token refreshed successfully",
      data: refreshTokenDTO,
      dateTime: new Date().toISOString(),
      detail: "Token refresh successful",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: "Error refreshing token",
      data: null,
      dateTime: new Date().toISOString(),
      detail: error?.response?.data?.msg || error.message || "Unknown error",
    };
  }
};

export const updateUserService = async (
  id: string,
  email: string,
  body: UpdateInput
): Promise<Update> => {
  let data;

  if (body.method === "email") {
    const userEntity = mapToUpdateEntity(body, email);

    const { data: updatedData, error } =
      await supabase.auth.admin.updateUserById(id, userEntity);

    if (error) {
      throw new Error(`DB: ${error.message}`);
    }
    if (!updatedData || !updatedData.user) {
      throw new Error("User update failed, no user data returned");
    }

    data = updatedData;
  } else {
    data = {
      user: {
        id,
        email,
      },
    };
  }

  const profile = body.full_name
    ? await updateProfileService(id, { full_name: body.full_name })
    : await getProfileService(id);

  const user = mapToUpdateDTO(data, profile);
  return user as Update;
};

export const deleteUserService = async (id: string): Promise<null> => {
  const { error: streakError } = await supabase
    .from("streak_activity")
    .delete()
    .eq("user_id", id);
  const { error: userStreaksError } = await supabase
    .from("user_streaks")
    .delete()
    .eq("user_id", id);
  const { error: profileError } = await supabase
    .from("profile")
    .delete()
    .eq("id", id);

  const { error: authError } = await supabase.auth.admin.deleteUser(id);

  if (streakError || userStreaksError || profileError || authError) {
    throw new Error(
      `DB: ${
        streakError?.message ||
        userStreaksError?.message ||
        profileError?.message ||
        authError?.message ||
        "Unknown error"
      }`
    );
  }

  return null;
};
