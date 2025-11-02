import { Router } from "express";
//import { videoUpload } from "../middleware/multerValidate";
//import { validate } from "../middleware/validate";
//import { uploadVideoSchema } from "../validators/cloudinary/videoValidator";
import { listVideosController, deleteVideoController, getVideoByIdController } from "../controllers/videoController";
//import { authenticate } from "../middleware/validateJwt";

const router = Router();

//router.get("/", authenticate, listVideosController);
router.get("/:folder", listVideosController);

/*router.post(
  "/:folder",
  //authenticate,
  videoUpload.single("video"),
  validate(uploadVideoSchema),
  uploadVideoController
);*/

//router.delete("/:id", authenticate, deleteVideoController);
router.delete("/:folder/:id", deleteVideoController);
router.get("/:folder/:id", getVideoByIdController)
export default router;