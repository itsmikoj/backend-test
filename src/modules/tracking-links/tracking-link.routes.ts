import { Router } from "express";
import { authenticate } from "../../middleware/validateJwt";
import {
  createTrackingLinkController,
  getTrackingLinksController,
  updateTrackingLinkController,
  deleteTrackingLinkController,
} from "./tracking-link.controller";

const router = Router();

router.post(
  "/app-tracker/:appTrackerId/tracking-links",
  authenticate,
  createTrackingLinkController
);

router.get(
  "/app-tracker/:appTrackerId/tracking-links",
  authenticate,
  getTrackingLinksController
);

router.patch(
  "/tracking-links/:linkId",
  authenticate,
  updateTrackingLinkController
);

router.delete(
  "/tracking-links/:linkId",
  authenticate,
  deleteTrackingLinkController
);

export default router;