import { OneSignalConfig } from "../types/onesignal.types";

export const NOTIFICATION_SETTINGS = {
    RETRY_COUNT: 3,
    CHUNK_SIZE: 2000,
    SENDING_HOURS: { start: 9, end: 22 }
} as const;

export function getOneSignalConfig(): OneSignalConfig {
    const appId = process.env.ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_API_KEY;
    const apiUrl = process.env.ONESIGNAL_URL;

    if (!appId || !apiKey || !apiUrl) {
        throw new Error(
            `Missing OneSignal config: ${!appId ? 'ONESIGNAL_APP_ID' : ''} ${!apiKey ? 'ONESIGNAL_API_KEY' : ''} ${!apiUrl ? 'ONESIGNAL_URL' : ''}`
        );
    }

    return { appId, apiKey, apiUrl };
}

export const ONESIGNAL_CONFIG = getOneSignalConfig();
