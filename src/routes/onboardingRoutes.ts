import { Router } from "express";
import { authenticate } from "../middleware/validateJwt";
import { validate } from "../middleware/validate";
import {
  createOnboardingController,
  getOnboardingController,
  updateOnboardingController,
} from "../controllers/onboardingController";
import { onboardingSchema } from "../validators/onboarding/onboardingValidator";

const onboardingRoutes = Router();

onboardingRoutes.use(authenticate);

onboardingRoutes.post("/", validate(onboardingSchema), createOnboardingController);
onboardingRoutes.get("/", getOnboardingController);
onboardingRoutes.put("/", validate(onboardingSchema), updateOnboardingController);

export default onboardingRoutes;