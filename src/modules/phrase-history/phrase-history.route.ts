import { Router } from "express";
import { getDailyPhaseHistoryController } from "./phrase-history.controller";
import { validateParams } from "../../middleware/validateParams";
import { dateValidatorSchema } from "./validators/date-validator";

const phraseRoutes = Router();

phraseRoutes.get(
  "/phrase",
  // validateParams(dateValidatorSchema),
  getDailyPhaseHistoryController
);

export default phraseRoutes;
