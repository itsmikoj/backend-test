import { Router } from "express";
import { authenticate } from "../middleware/validateJwt";
import { validate } from "../middleware/validate";
import { profileSchema } from "../validators/profile/profileValidator";
import {
  getProfileController,
  createProfileController,
  updateProfileController,
} from "../controllers/profileController";
import {
  upload,
  uploadPhotoController,
} from "../controllers/uploadPhotoController";
import { validateImage } from "../middleware/validateImage";
import { multerErrorHandler } from "../middleware/multerErrorHandler";

const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.get("/", getProfileController);
profileRoutes.post("/", validate(profileSchema), createProfileController);
profileRoutes.put("/", validate(profileSchema), updateProfileController);
profileRoutes.post(
  "/upload-photo",
  [upload.single("image"), validateImage],
  uploadPhotoController
);

profileRoutes.use(multerErrorHandler);

export default profileRoutes;
