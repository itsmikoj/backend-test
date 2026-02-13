import { Request, Response } from "express";
import { Webhook } from "svix";
import {
  getAllSuperwallEventsService,
  handleSuperwallEvent,
} from "./superwall.service";
import { SuperwallWebhookPayload } from "./superwall.interface";
import { Status } from "../../types/status.enum";
import { superwallPathParamDto } from "./validator/superwall-path-param.validator";
import { findAppTrackerByIdService } from "../app-tracker/app-tracker.service";

export class SuperwallWebhookController {
  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body.toString();

      const headers = {
        "svix-id": req.headers["svix-id"] as string,
        "svix-timestamp": req.headers["svix-timestamp"] as string,
        "svix-signature": req.headers["svix-signature"] as string,
      };

      console.log("📨 Headers recibidos:", headers);

      const secret = process.env.SUPERWALL_WEBHOOK_SECRET;
      if (!secret) {
        console.error("❌ SUPERWALL_WEBHOOK_SECRET no configurado");
        res.status(500).json({ error: "Webhook secret not configured" });
        return;
      }

      const wh = new Webhook(secret);
      let verifiedEvent;

      try {
        verifiedEvent = wh.verify(payload, headers);
        console.log("✅ Webhook verificado correctamente");
      } catch (err: any) {
        console.error("❌ Verificación falló:", err.message);
        res.status(400).json({ error: "Webhook verification failed" });
        return;
      }

      const event = verifiedEvent as SuperwallWebhookPayload;
      const result = await handleSuperwallEvent(event);

      res.status(200).json(result);
    } catch (error: any) {
      console.error("❌ Webhook Error:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

  static async getAllSuperwallEvents(req: Request, res: Response) {
    try {
      const user = req.user!;
      const params = req.params as superwallPathParamDto;

      //validate that app tracker exists
      const appTracker = await findAppTrackerByIdService(params.app_tracker_id);

      if (!appTracker)
        return res.status(400).json({
          ok: false,
          message: "App tracker not found",
        });

      //validate that user has access to app tracker
      if (appTracker.user_id !== user.id)
        return res.status(403).json({
          ok: false,
          message: "You do not have access to this app tracker",
        });

      const events = await getAllSuperwallEventsService(params.app_tracker_id);

      res.status(200).json({
        ok: true,
        message: "Events fetched successfully",
        data: events,
      });
    } catch (error: any) {
      console.log(error);

      res.status(500).json({
        ok: false,
        message: "Error fetching events",
      });
    }
  }
}
