import { Router } from "express";
import {
    sendPrayerNotificationsController,
} from "../controllers/notifications.controller";

const notificationsRoutes = Router();

notificationsRoutes.post("/send-prayer-notifications", sendPrayerNotificationsController);

export default notificationsRoutes;
