import { Router } from "express";
import { streamChatController } from "../controllers/chatController";
import {
  relationshipChat,
  lifeChallengesChat,
  forgivenessChat,
  prayerChat,
  bibleChat,
} from "../controllers/customChatController";
import { validate } from "../middleware/validate";
import { streamingSchema } from "../validators/streamingValidator";
import { authenticate } from "../middleware/validateJwt";

const chatRoutes = Router();

// Authenticate the request
chatRoutes.use(authenticate);

// Validate the request body
chatRoutes.use(validate(streamingSchema));

// Routes
chatRoutes.post("/stream", streamChatController);
chatRoutes.post("/relationship", relationshipChat);
chatRoutes.post("/life-challenges", lifeChallengesChat);
chatRoutes.post("/forgiveness", forgivenessChat);
chatRoutes.post("/prayer", prayerChat);
chatRoutes.post("/bible", bibleChat);

export default chatRoutes;
