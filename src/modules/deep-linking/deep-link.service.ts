import { Request } from "express";

interface DeepLinkConfig {
  app_store_url: string;
  play_store_url: string;
  deep_link_scheme: string;
  fallback_url: string;
  custom_params?: Record<string, any>;
}

export const generateDeepLink = (
  config: DeepLinkConfig,
  userAgent: string
): string => {
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  // Si tiene deep link scheme, intentar abrir la app primero
  if (config.deep_link_scheme && config.custom_params) {
    const params = new URLSearchParams(config.custom_params).toString();
    const deepLinkUrl = `${config.deep_link_scheme}?${params}`;

    // En iOS/Android, primero intentamos abrir la app
    if (isIOS || isAndroid) {
      return deepLinkUrl;
    }
  }

  // Fallback a las stores
  if (isIOS && config.app_store_url) {
    return config.app_store_url;
  }

  if (isAndroid && config.play_store_url) {
    return config.play_store_url;
  }

  // Fallback final
  return config.fallback_url || config.app_store_url;
};

export const buildUniversalLink = (
  scheme: string,
  params: Record<string, any>
): string => {
  const queryString = new URLSearchParams(params).toString();
  return `${scheme}?${queryString}`;
};

export const isMobileDevice = (userAgent: string): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
};

export const detectPlatform = (userAgent: string): "ios" | "android" | "web" => {
  if (/iPhone|iPad|iPod/.test(userAgent)) return "ios";
  if (/Android/.test(userAgent)) return "android";
  return "web";
};