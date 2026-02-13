import { supabase } from "../../utils/supabaseClient";
import { findAttributionClick } from "../attributions/attribution.service";
import { InstallInterface } from "./interface/install.interface";
import { InstallDto } from "./validator/install.validator";
import { generateFingerprint } from "../fingerprinting/fingerprint.service";

const tableName = "install_tracker";

export const createInstallService = async (
  app_tracker_id: string,
  body: InstallDto,
  req: any // ✅ Tercer parámetro para generar fingerprint
) => {
  // Generar fingerprint del install
  const fingerprint = generateFingerprint(req);

  // Buscar click de atribución (ahora con fingerprint)
  const attributionClick = await findAttributionClick(
    body.app.bundle_id,
    body.timestamp,
    fingerprint.hash // Pasar fingerprint
  );

  const { data, error } = await supabase
    .from(tableName)
    .insert({
      app_tracker_id,
      event_id: body.event_id,
      timestamp: body.timestamp,
      platform: body.platform,
      event_name: body.event_name,
      privacy_att_status: body.privacy.att_status,

      app_bundle_id: body.app.bundle_id,
      app_version: body.app.version,
      app_build: body.app.build,

      device_idfv: body.device.idfv,
      device_os_version: body.device.os_version,
      device_locale: body.device.locale,
      device_model: body.device.model,
      device_timezone: body.device.timezone,
      device_idfa: body.device.idfa,
      fingerprint_hash: fingerprint.hash, 

      campaign_id: attributionClick?.campaign_id || null,
      adset_id: attributionClick?.adset_id || null,
      ad_id: attributionClick?.ad_id || null,
      tracking_link_id: attributionClick?.tracking_link_id || null, 
      source: attributionClick?.source || "organic",
      attribution_method: attributionClick
        ? attributionClick.fingerprint_hash === fingerprint.hash
          ? "fingerprint"
          : "last_click"
        : "organic", 
    })
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error("createInstallService: " + error.message);
  }

  if (attributionClick?.tracking_link_id) {
    await supabase.rpc("increment_tracking_link_installs", {
      link_id: attributionClick.tracking_link_id,
    });
  }

  return data as InstallInterface;
};

export const getInstallsByAppTrackerIdService = async (trackerId: string) => {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("app_tracker_id", trackerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("getInstallsByAppTrackerIdService: " + error.message);
  }

  return data as InstallInterface[];
};