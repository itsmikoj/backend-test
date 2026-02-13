import { supabase } from "../../utils/supabaseClient";
import { AppTrackerInterface } from "./interface/app-tracker.interface";
import { AppTrackerDto } from "./validator/app-tracker.validator";

export const createAppTrackerService = async (
  userId: string,
  body: AppTrackerDto,
): Promise<AppTrackerInterface> => {
  const { data, error } = await supabase
    .from("app_tracker")
    .insert({
      user_id: userId,
      app_name: body.app_name,
      bundle_id: body.bundle_id,
      app_store_url: body.app_store_url,
      play_store_url: body.play_store_url, 
      deep_link_scheme: body.deep_link_scheme, 
      fallback_url: body.fallback_url, 
    })
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error("createAppTrackerService: " + error.message);
  }

  return data as AppTrackerInterface;
};

export const getFindAppTrackerByBundleIdService = async (
  userId: string,
  bundleId: string,
): Promise<AppTrackerInterface> => {
  const { data, error } = await supabase
    .from("app_tracker")
    .select("*")
    .eq("bundle_id", bundleId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("getFindAppTrackerByBundleIdService: " + error.message);
  }

  return data as AppTrackerInterface;
};

export const findAppTrackerByIdService = async (
  appTrackerId: string,
): Promise<AppTrackerInterface> => {
  const { data, error } = await supabase
    .from("app_tracker")
    .select("*")
    .eq("id", appTrackerId)
    .maybeSingle();

  if (error) {
    throw new Error("getFindAppTrackerByIdService: " + error.message);
  }

  return data as AppTrackerInterface;
};

export const getAllAppTrackerServiceByUserId = async (
  userId: string,
): Promise<AppTrackerInterface[]> => {
  const { data, error } = await supabase
    .from("app_tracker")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("getAllAppTrackerServiceByUserId: " + error.message);
  }

  return data as AppTrackerInterface[];
};