import { OneSignalPayload } from "../../types/onesignal.types";
import { ONESIGNAL_CONFIG, NOTIFICATION_SETTINGS } from "../../config/onesignal.config";
import {
    OneSignalResponse,
    MultiLanguageMessage
} from "../../types/notification.interfaces";

export async function sendOneSignalNotification(
    payload: OneSignalPayload,
    attempt: number = 1
): Promise<OneSignalResponse> {
    try {
        console.log(
            `[OneSignal] Attempt ${attempt}: Sending to ${payload.include_aliases.external_id.length} users`
        );

        const response = await fetch(`${ONESIGNAL_CONFIG.apiUrl}`, {
            method: "POST",
            headers: {
                "Authorization": `${ONESIGNAL_CONFIG.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.errors && data.errors.length > 0) {
            console.error(`[OneSignal] API returned errors:`, data.errors);
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
        }

        return {
            id: data.id || "",
            errors: data.errors || null,
            url: `https://onesignal.com/apps/${ONESIGNAL_CONFIG.appId}/notifications/${data.id}`
        };

    } catch (err) {
        console.error(`[OneSignal] Attempt ${attempt} failed:`, err);

        if (attempt < NOTIFICATION_SETTINGS.RETRY_COUNT) {
            const delay = 1000 * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            return sendOneSignalNotification(payload, attempt + 1);
        }

        return {
            id: "",
            errors: [err instanceof Error ? err.message : "Unknown error"]
        };
    }
}

export function buildOneSignalPayload(
    externalIds: string[],
    message: MultiLanguageMessage,
    data: Record<string, any>
): OneSignalPayload {
    return {
        app_id: ONESIGNAL_CONFIG.appId,
        include_aliases: {
            external_id: externalIds
        },
        target_channel: "push",
        contents: {
            en: message.en.body,
            es: message.es.body
        },
        headings: {
            en: message.en.title,
            es: message.es.title
        },
        data,
        ios_sound: "default",
        priority: 10,
        ttl: 86400
    };
}
