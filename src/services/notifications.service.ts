import { supabase } from "../utils/supabaseClient";
import { NotificationResult, OneSignalResponse } from "../types/notification.interfaces";
import { getRandomMessage } from "../utils/notification/messageBank";
import { chunkArray } from "../utils/notification/arrayUtils";
import {
    sendOneSignalNotification,
    buildOneSignalPayload
} from "../utils/notification/oneSignalClient";
import { NOTIFICATION_SETTINGS } from "../config/onesignal.config";

export const sendPrayerNotificationsService = async (): Promise<NotificationResult> => {
    try {
        const isWithinHours = validateSendingHours();
        if (!isWithinHours.valid) {
            return createEmptyResult(isWithinHours.message!, isWithinHours.status!);
        }

        const usersToNotify = await getUsersToNotify();
        if (usersToNotify.length === 0) {
            return createEmptyResult("All users have prayed today! 🙏", "no_users");
        }

        console.log(`[Prayer Notifications] Found ${usersToNotify.length} users to notify`);

        const userChunks = chunkArray(usersToNotify, NOTIFICATION_SETTINGS.CHUNK_SIZE);

        const allResults = [];
        for (const chunk of userChunks) {
            const result = await sendNotificationChunk(chunk);
            allResults.push(result);

            if (userChunks.length > 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log(`[Prayer Notifications] ✅ Sent to ${usersToNotify.length} users successfully`);

        return {
            totalMessages: usersToNotify.length,
            totalChunks: userChunks.length,
            results: allResults.flat(),
            message: `Sent to ${usersToNotify.length} users in ${userChunks.length} chunk${userChunks.length > 1 ? 's' : ''}`,
            status: "success"
        };

    } catch (error) {
        console.error("[sendPrayerNotificationsService] Error:", error);
        throw error;
    }
};

function validateSendingHours(): { valid: boolean; message?: string, status?: string } {
    const hour = new Date().getHours();
    const sendingHours = NOTIFICATION_SETTINGS.SENDING_HOURS

    if (hour < sendingHours.start || hour > sendingHours.end) {
        return {
            valid: false,
            message: `Outside sending hours (${sendingHours.start}am-${sendingHours.end}pm)`,
            status: "outside_hours"
        };
    }

    return { valid: true };
}

async function getUsersToNotify(): Promise<Array<{ user_id: string }>> {
    const today = new Date().toISOString().split("T")[0];
    console.log(today)
    const { data: allUsers, error: usersError } = await supabase
        .from("user_streaks")
        .select("user_id");

    if (usersError) throw usersError;
    if (!allUsers || allUsers.length === 0) return [];

    const { data: prayedToday, error: prayedError } = await supabase
        .from("streak_activity")
        .select("user_id")
        .eq("completed_at", today);

    if (prayedError) throw prayedError;

    const prayedIds = new Set(prayedToday?.map((u) => u.user_id) || []);
    return allUsers.filter((u) => !prayedIds.has(u.user_id));
}

async function sendNotificationChunk(
    users: Array<{ user_id: string }>
): Promise<OneSignalResponse> {
    const message = getRandomMessage();

    const externalIds = users.map((u) => u.user_id);

    const payload = buildOneSignalPayload(externalIds, message, {
        type: "prayer_reminder",
        screen: "Prayer",
        date: new Date().toISOString().split("T")[0]
    });

    const result = await sendOneSignalNotification(payload);

    return result;
}

function createEmptyResult(message: string, status?: any): NotificationResult {
    return {
        totalMessages: 0,
        totalChunks: 0,
        results: [],
        message,
        status
    };
}
