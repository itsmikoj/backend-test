import { Router } from "express";
import {
  getAllFriendsController,
  getFriendByFullNameController,
  getPendingFriendRequestController,
  sendRequestFriendshipController,
  updateStatusFriendController,
  resendFriendRequestController
} from "../controllers/friendsController";
import { authenticate } from "../middleware/validateJwt";
import { validate } from "../middleware/validate";
import { processRequestFriendSchema } from "../validators/friend/processRequestFriendValidator";
import { createRequestFriendSchema } from "../validators/friend/createRequestFrienValidator";

const friendsRoutes = Router();

friendsRoutes.use(authenticate);

friendsRoutes.get("/", getAllFriendsController);

friendsRoutes.get("/search", getFriendByFullNameController);

friendsRoutes.post(
  "/request",
  validate(createRequestFriendSchema),
  sendRequestFriendshipController
);

friendsRoutes.get("/request", getPendingFriendRequestController);

friendsRoutes.post(
  "/request/process",
  validate(processRequestFriendSchema),
  updateStatusFriendController
);

friendsRoutes.post("/request/reset", resendFriendRequestController);

export default friendsRoutes;
