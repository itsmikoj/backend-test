import { Router } from "express";
import {
  trackEventController,
  batchTrackEventsController,
  getMetricsController,
} from "./tracking.controller";
import { authenticate } from "../../middleware/validateJwt";
import { validate } from "../../middleware/validate";
import {
  trackEventSchema,
  batchEventsSchema,
} from "../../validators/tracking/trackingValidator";

const router = Router();

router.use(authenticate);

router.post("/events", validate(trackEventSchema), trackEventController);
router.post("/events/batch", validate(batchEventsSchema), batchTrackEventsController);
router.post("/metrics", getMetricsController);

export default router;
