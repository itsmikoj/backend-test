import { RefreshTokenDTO } from "../models/refreshTokenDTO";

export const toRefreshTokenDTO = (supabaseResponse: any): RefreshTokenDTO => {
  return {
    access_token: supabaseResponse.access_token,
    refresh_token: supabaseResponse.refresh_token,
    expires_in: supabaseResponse.expires_in,
    expires_at: supabaseResponse.expires_at,
    token_type: supabaseResponse.token_type,
  };
};
