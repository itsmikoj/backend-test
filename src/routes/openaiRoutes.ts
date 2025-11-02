import { Router } from "express";
import { validate } from "../middleware/validate";
import { prayerSchema } from "../validators/openai/openaiValidator";
import {
  citationController,
  prayerController,
} from "../controllers/openaiController";

const openaiRoutes = Router();

openaiRoutes.get("/citation", citationController);
openaiRoutes.post("/prayer", validate(prayerSchema), prayerController);

export default openaiRoutes;
