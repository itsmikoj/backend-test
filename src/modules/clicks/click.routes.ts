import { Router } from "express";
import { clickHandler } from "./clicks.service";

const router = Router();

router.get("/c/:linkId", clickHandler);

export default router;