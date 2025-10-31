import { Profile } from "../types/supabase";
import { LoginInput, UpdateInput } from "../validators/auth/authValidator";

type LoginEntity = {
  user: {
    id: string;
    email?: string;
  };
  session: {
    refresh_token: string;
    access_token: string;
  };
};

type RegisterEntity = {
  user?: {
    id?: string;
    email?: string;
  } | null;
  session: {
    refresh_token?: string;
    access_token?: string;
  } | null;
};

type UpdateEntity = {
  user?: {
    id?: string;
    email?: string;
  } | null;
};

export function mapToAuthEntity(body: LoginInput) {
  return {
    email: body.email,
    password: body.password,
  };
}

export function mapToUpdateEntity(body: UpdateInput, email: string) {
  const data: any = {};

  if (body.email) {
    data.email = body.email.toLowerCase().trim();
  }
  if (body.password) {
    data.password = body.password;
  }

  return data;
}

export function mapToLoginDTO(authResponse: LoginEntity, profile: Profile) {
  return {
    email: authResponse.user.email || "Not provided",
    full_name: profile.full_name || "User not provided",
    access_token: authResponse.session.access_token || "Not provided",
    refresh_token: authResponse.session.refresh_token || "Not provided",
  };
}

export function mapToRegisterDTO(
  authResponse: RegisterEntity,
  profile: Profile
) {
  return {
    email: authResponse.user?.email || "Not provided",
    full_name: profile.full_name || "User not provided",
    access_token: authResponse.session?.access_token || "Not provided",
    refresh_token: authResponse.session?.refresh_token || "Not provided",
  };
}

export function mapToUpdateDTO(authResponse: UpdateEntity, profile: Profile) {
  return {
    email: authResponse.user?.email || "Not provided",
    full_name: profile.full_name || "User not provided",
  };
}
