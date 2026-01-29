import { Router } from "express";
import { authenticate } from "../../middleware/validateJwt";
import { validate } from "../../middleware/validate";
import { profileSchema } from "../../validators/profile/profileValidator";
import {
  getProfileController,
  createProfileController,
  updateProfileController,
} from "./profile.controller";

const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.get("/", getProfileController);
profileRoutes.post("/", validate(profileSchema), createProfileController);
profileRoutes.put("/", validate(profileSchema), updateProfileController);

export default profileRoutes;
