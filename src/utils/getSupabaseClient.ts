import { createClient } from "@supabase/supabase-js";
import { config } from "../config/config";

export const getSupabaseClientWithUser = (userToken: string) => {
  return createClient(config.supabase.url, config.supabase.anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${userToken}`,
        apikey: config.supabase.anonKey,
      },
    },
  });
};
