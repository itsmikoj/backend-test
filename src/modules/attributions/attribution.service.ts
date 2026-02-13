import { supabase } from "../../utils/supabaseClient";

export const findAttributionClick = async (
  bundleId: string,
  installTimestamp: number,
  deviceFingerprint?: string 
) => {
  const attributionWindow = 7 * 24 * 60 * 60 * 1000;
  const minTime = new Date(installTimestamp - attributionWindow).toISOString();

  if (deviceFingerprint) {
    const { data: fingerprintMatch } = await supabase
      .from("ad_clicks")
      .select("*")
      .eq("bundle_id", bundleId)
      .eq("fingerprint_hash", deviceFingerprint)
      .gte("created_at", minTime)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fingerprintMatch) {
      console.log("✅ Attribution por fingerprint");
      return fingerprintMatch;
    }
  }

  const { data, error } = await supabase
    .from("ad_clicks")
    .select("*")
    .eq("bundle_id", bundleId)
    .gte("created_at", minTime)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Attribution error:", error);
    return null;
  }

  if (data) {
    console.log("⚠️ Attribution por last-click (sin fingerprint match)");
  }

  return data;
};