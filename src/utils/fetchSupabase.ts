import axios from "axios";
import { config } from "../config/config";

export const supabaseApi = (token?: string) => {
  return axios.create({
    baseURL: config.supabase.url,
    headers: {
      Authorization: `Bearer ${token ?? config.supabase.serviceRoleKey}`,
      apikey: config.supabase.anonKey,
      "Content-Type": "application/json",
      // Prefer: "return=representation",
    },
  });
};
