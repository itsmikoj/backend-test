import { Router } from "express";
import { validate } from "../middleware/validate";
import { feedbackSchema } from "../validators/feedback/feedbackValidator";
import { feedbackController } from "../controllers/feedbackController";

const feedbackRoutes = Router();

feedbackRoutes.post("/", validate(feedbackSchema), feedbackController);

export default feedbackRoutes;
