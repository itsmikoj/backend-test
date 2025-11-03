import { Router } from "express";
import { authenticate } from "../middleware/validateJwt";
import { validate } from "../middleware/validate";
import {
  postProfileSchema,
  putProfileSchema,
} from "../validators/profile/profileValidator";
import {
  getProfileController,
  createProfileController,
  updateProfileController,
  checkUsernameController,
  updateUsernameController,
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
profileRoutes.post("/", validate(postProfileSchema), createProfileController);
profileRoutes.put("/", validate(putProfileSchema), updateProfileController);
profileRoutes.post("/check-username", checkUsernameController)
profileRoutes.post(
  "/upload-photo",
  [upload.single("image"), validateImage],
  uploadPhotoController
);
profileRoutes.postt("/update-username", updateUsernameController);

profileRoutes.use(multerErrorHandler);

export default profileRoutes;
