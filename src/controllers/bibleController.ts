import { Request, Response } from "express";
import { bibleByChapters, fetchChapters } from "../utils/fetchApiBible";

export const getChapter = async (req: Request, res: Response) => {
  try {
    const { chapter_id } = req.params;

    if (!chapter_id || chapter_id.trim().length < 3) {
      res.status(400).json({
        message: "chapter_id is required or invalid, example: GEN.10",
      });
      return;
    }

    const chapter = await bibleByChapters(chapter_id);

    if (!chapter.data) {
      res.status(404).json({ message: "Chapter not found" });
      return;
    }

    res.status(200).json(chapter);
  } catch (error) {
    console.log("Error fetching find chapter by book", error);
    res.status(500).json({ message: "Error fetching chapter" });
  }
};

export const getAllChaptersByBook = async (req: Request, res: Response) => {
  try {
    const { book_id } = req.params;

    if (!book_id || book_id.trim().length < 3) {
      res.status(400).json({
        message: "book_id is required or invalid, example: GEN",
      });
      return;
    }

    const chapters = await fetchChapters(book_id);

    res.status(200).json(chapters);
  } catch (error) {
    console.log("Error fetching chapters by book", error);
    res.status(500).json({ message: "Error fetching chapters by book" });
  }
};
