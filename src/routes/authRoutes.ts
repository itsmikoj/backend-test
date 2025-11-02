import { Router } from "express";
import {
  postLoginSchema,
  postRegisterSchema,
  updateAuthSchema,
} from "../validators/auth/authValidator";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/validateJwt";
import {
  registerUserController,
  loginUserController,
  refreshToken,
  validateTokenController,
  updateUserController,
  deleteUserController,
} from "../controllers/authController";

const authRoutes = Router();

authRoutes.post(
  "/register",
  validate(postRegisterSchema),
  registerUserController
);
authRoutes.post("/login", validate(postLoginSchema), loginUserController);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.post("/validate-token", validateTokenController);
authRoutes.delete("/delete", authenticate, deleteUserController);
authRoutes.put(
  "/update",
  authenticate,
  validate(updateAuthSchema),
  updateUserController
);

export default authRoutes;
