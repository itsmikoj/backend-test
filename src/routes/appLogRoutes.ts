import { Router } from "express";
import { appLogController } from "../controllers/appLogController";
import { validate } from "../middleware/validate";
import { appLogSchema } from "../validators/app_logs/appLogsValidator";

const appLogRoutes = Router();

appLogRoutes.post("/", validate(appLogSchema), appLogController);

export default appLogRoutes;
