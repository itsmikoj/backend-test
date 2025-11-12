import { Request, Response } from "express";
import { sendPrayerNotificationsService } from "../services/notifications.service";

export const sendPrayerNotificationsController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const cronToken = req.headers['x-cron-token'];

        if (!cronToken || cronToken !== process.env.CRON_PUSH_SECRET) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized - Invalid cron token'
            });
            return;
        }

        console.log("[sendPrayerNotifications] 🚀 Starting notification process...");

        const result = await sendPrayerNotificationsService();

        if (result.status === 'outside_hours') {
            res.status(200).json({
                success: false,
                data: {
                    status: 'scheduled',
                    message: result.message,
                    timestamp: new Date().toISOString()
                }
            });
            return;
        }

        if (result.status === 'no_users') {
            res.status(200).json({
                success: false,
                data: {
                    status: 'completed',
                    message: result.message,
                    timestamp: new Date().toISOString()
                }
            });
            return;
        }

        console.log(`[sendPrayerNotifications] ✅ Completed: ${result.totalMessages} messages sent`);

        res.status(200).json({
            success: true,
            data: {
                usersNotified: result.totalMessages,
                chunksProcessed: result.totalChunks,
                notificationId: result.results[0]?.id || null,
                status: "completed",
                message: `✅ Sent to ${result.totalMessages} users successfully`,
                dashboardUrl: result.results[0]?.url,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error("[sendPrayerNotifications] ❌ Controller error:", error);

        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
