import { Router } from "express";
import { SuperwallWebhookController } from "./superwall.controller";
import { authenticate } from "../../middleware/validateJwt";
import { superwallPathParamSchema } from "./validator/superwall-path-param.validator";
import { validatePathParameter } from "../../middleware/validatePathParameter";

const superwallRouter = Router();

superwallRouter.post("/", SuperwallWebhookController.handleWebhook);

superwallRouter.get(
  "/app-tracker/:app_tracker_id",
  [authenticate, validatePathParameter(superwallPathParamSchema)],
  SuperwallWebhookController.getAllSuperwallEvents,
);

export default superwallRouter;
