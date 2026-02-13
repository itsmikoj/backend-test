import { supabase } from "../../utils/supabaseClient";
import { TrackingLinkInterface } from "./tracking-link.interface";
import { CreateTrackingLinkDto } from "./tracking-link.validator";
import { generateId } from "./tracking-link.utils";

export const createTrackingLinkService = async (
  appTrackerId: string,
  body: CreateTrackingLinkDto,
): Promise<TrackingLinkInterface> => {
  const linkId = await generateId(10);

  const { data, error } = await supabase
    .from("tracking_links")
    .insert({
      id: linkId,
      app_tracker_id: appTrackerId,
      campaign_id: body.campaign_id,
      adset_id: body.adset_id,
      ad_id: body.ad_id,
      link_name: body.link_name,
      custom_params: body.custom_params || {},
    })
    .select("*")
    .single();

  if (error) {
    throw new Error("createTrackingLinkService: " + error.message);
  }

  return data as TrackingLinkInterface;
};

export const getTrackingLinkByIdService = async (
  linkId: string,
): Promise<TrackingLinkInterface | null> => {
  const { data, error } = await supabase
    .from("tracking_links")
    .select(
      `
      *,
      app_tracker:app_tracker_id (
        id,
        app_name,
        bundle_id,
        app_store_url,
        play_store_url,
        deep_link_scheme,
        fallback_url
      )
    `,
    )
    .eq("id", linkId)
    .maybeSingle();

  if (error) {
    throw new Error("getTrackingLinkByIdService: " + error.message);
  }

  return data;
};

export const getTrackingLinksByAppTrackerIdService = async (
  appTrackerId: string,
): Promise<TrackingLinkInterface[]> => {
  const { data, error } = await supabase
    .from("tracking_links")
    .select("*")
    .eq("app_tracker_id", appTrackerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("getTrackingLinksByAppTrackerIdService: " + error.message);
  }

  return data as TrackingLinkInterface[];
};

export const updateTrackingLinkService = async (
  linkId: string,
  updates: Partial<CreateTrackingLinkDto>,
): Promise<TrackingLinkInterface> => {
  const { data, error } = await supabase
    .from("tracking_links")
    .update(updates)
    .eq("id", linkId)
    .select("*")
    .single();

  if (error) {
    throw new Error("updateTrackingLinkService: " + error.message);
  }

  return data as TrackingLinkInterface;
};

export const deleteTrackingLinkService = async (
  linkId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("tracking_links")
    .delete()
    .eq("id", linkId);

  if (error) {
    throw new Error("deleteTrackingLinkService: " + error.message);
  }
};
