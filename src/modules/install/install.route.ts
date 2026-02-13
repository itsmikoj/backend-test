import { Router } from "express";
import { validate } from "../../middleware/validate";
import { installSchema } from "./validator/install.validator";
import {
  createInstallController,
  getInstallsByAppTrackerIdController, 
} from "./install.controller";
import { authenticate } from "../../middleware/validateJwt";
import { validatePathParameter } from "../../middleware/validatePathParameter";
import { installPathParamSchema } from "./validator/install-path-param.validator";

const installRouter = Router();

installRouter.get(
  "/app-tracker/:app_tracker_id",
  [authenticate, validatePathParameter(installPathParamSchema)],
  getInstallsByAppTrackerIdController 
);

installRouter.post("/", validate(installSchema), createInstallController);

export default installRouter;