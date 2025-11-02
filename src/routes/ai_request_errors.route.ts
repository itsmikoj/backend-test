import { Router } from "express";
import { validate } from "../middleware/validate";
import { aiRequestErrorsSchema } from "../validators/ai_request_errors/ai_request_errors.validator";
import { createAiRequestErrorsController } from "../controllers/aiRequestErrorsController";
// import { authenticate } from "../middleware/validateJwt";

const aiRequestErrorsRoutes = Router();

// aiRequestErrorsRoutes.use(authenticate);

aiRequestErrorsRoutes.post(
  "/",
  validate(aiRequestErrorsSchema),
  createAiRequestErrorsController
);

export default aiRequestErrorsRoutes;
