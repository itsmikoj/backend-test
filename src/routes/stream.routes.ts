import { Router } from "express";
import { getTokenStream, CreateController } from "../controllers/stream.controller";
import { authenticate } from "../middleware/validateJwt";

const streamRoutes = Router();

streamRoutes.use(authenticate);

streamRoutes.post("/token", getTokenStream);
streamRoutes.post("/create", CreateController);

export default streamRoutes;
