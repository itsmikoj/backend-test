import { Request } from "express";
import crypto from "crypto";

export interface DeviceFingerprint {
  hash: string;
  ip: string;
  user_agent: string;
  accept_language: string | undefined;
  platform: string;
}

export const generateFingerprint = (req: Request): DeviceFingerprint => {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
  const userAgent = req.headers["user-agent"] || "";
  const acceptLanguage = req.headers["accept-language"];
  const platform = detectPlatform(userAgent);

  const fingerprintString = `${ip}-${userAgent}-${acceptLanguage}-${platform}`;
  const hash = crypto
    .createHash("sha256")
    .update(fingerprintString)
    .digest("hex");

  return {
    hash,
    ip,
    user_agent: userAgent,
    accept_language: acceptLanguage,
    platform,
  };
};

const detectPlatform = (userAgent: string): string => {
  if (/iPhone|iPad|iPod/.test(userAgent)) return "ios";
  if (/Android/.test(userAgent)) return "android";
  if (/Windows/.test(userAgent)) return "windows";
  if (/Mac/.test(userAgent)) return "mac";
  return "unknown";
};

export const matchFingerprint = (
  storedFingerprint: string,
  currentFingerprint: string
): boolean => {
  return storedFingerprint === currentFingerprint;
};