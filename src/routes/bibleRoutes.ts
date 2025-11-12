import { Router } from "express";
import {
  getAllChaptersByBook,
  getChapter,
} from "../controllers/bibleController";
import { authenticate } from "../middleware/validateJwt";

const bibleRoutes = Router();

bibleRoutes.use(authenticate);

bibleRoutes.get("/chapter/:chapter_id", getChapter);

bibleRoutes.get("/book-chapters/:book_id", getAllChaptersByBook);

export default bibleRoutes;
