import { Request, Response } from "express";
import { supabase } from "../../utils/supabaseClient";
import { getTrackingLinkByIdService } from "../tracking-links/tracking-link.service";
import { detectPlatform } from "../deep-linking/deep-link.service";
import { getDeferredDeepLinkHTML } from "../deep-linking/deep-link.html";
import { generateFingerprint } from "../fingerprinting/fingerprint.service";

export const clickHandler = async (req: Request, res: Response) => {
  try {
    const linkId = req.params.linkId as string; 

    if (!linkId) {
      return res.status(400).send("Link ID is required");
    }

    const trackingLink = await getTrackingLinkByIdService(linkId);

    if (!trackingLink || !trackingLink.app_tracker) {
      return res.status(404).send("Link not found");
    }

    const appTracker = trackingLink.app_tracker;

    const fingerprint = generateFingerprint(req);

    const click = {
      tracking_link_id: linkId,
      bundle_id: appTracker.bundle_id,
      campaign_id: trackingLink.campaign_id,
      adset_id: trackingLink.adset_id,
      ad_id: trackingLink.ad_id,
      source: "meta",
      ip: fingerprint.ip,
      user_agent: fingerprint.user_agent,
      fingerprint_hash: fingerprint.hash,
      platform: fingerprint.platform,
      fbclid: (req.query.fbclid as string) || null, 
    };

    await supabase.from("ad_clicks").insert(click);

    await supabase.rpc("increment_tracking_link_clicks", {
      link_id: linkId,
    });

    console.log("✅ Click guardado:", click);

    const userAgent = req.headers["user-agent"] || "";
    const platform = detectPlatform(userAgent);

    if (appTracker.deep_link_scheme) {
      const deepLinkParams = new URLSearchParams({
        tracking_id: linkId, 
      });

      if (trackingLink.custom_params && typeof trackingLink.custom_params === 'object') {
        Object.entries(trackingLink.custom_params).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            deepLinkParams.append(key, String(value));
          }
        });
      }

      const deepLinkUrl = `${appTracker.deep_link_scheme}?${deepLinkParams.toString()}`;

      const storeUrl = platform === "ios" 
        ? appTracker.app_store_url 
        : appTracker.play_store_url;

      const html = getDeferredDeepLinkHTML(storeUrl, deepLinkUrl, appTracker.app_name);
      return res.send(html);
    }

    let redirectUrl = appTracker.fallback_url || appTracker.app_store_url;

    if (platform === "ios" && appTracker.app_store_url) {
      redirectUrl = appTracker.app_store_url;
    } else if (platform === "android" && appTracker.play_store_url) {
      redirectUrl = appTracker.play_store_url;
    }

    return res.redirect(redirectUrl);

  } catch (error) {
    console.error("❌ Error click handler:", error);
    return res.status(500).json({ error: "internal error" });
  }
};