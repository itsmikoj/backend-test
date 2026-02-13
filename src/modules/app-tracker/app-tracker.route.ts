import { Router } from "express";
import { validate } from "../../middleware/validate";
import { appTrackerSchema } from "./validator/app-tracker.validator";
import {
  createAppTrackerController,
  getAllAppTrackerController,
} from "./app-tracker.controller";
import { authenticate } from "../../middleware/validateJwt";

const appTrackerRoutes = Router();

appTrackerRoutes.use(authenticate);

appTrackerRoutes.post(
  "/",
  validate(appTrackerSchema),
  createAppTrackerController,
);

appTrackerRoutes.get("/", getAllAppTrackerController);

export default appTrackerRoutes;
