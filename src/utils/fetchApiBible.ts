import { BibleBookJson } from "../types/BibleBooks.interfaces";
import { BibleByChapters } from "../types/BibleByChapters.interfaces";
import { BibleChaptersResponse } from "../types/BibleChapters,intefaces";

const API_KEY = process.env.BIBLE_API_KEY ?? "";

const BASE_URL =
  "https://api.scripture.api.bible/v1/bibles/06125adad2d5898a-01";

export const bibleByChapters = async (chapterID: string) => {
  const response = await fetch(
    `${BASE_URL}/chapters/${chapterID}?content-type=text`,
    {
      headers: {
        "api-key": API_KEY,
      },
    }
  );

  return response.json() as Promise<BibleByChapters>;
};

export const bibleBooks = async () => {
  const response = await fetch(`${BASE_URL}/books`, {
    headers: {
      "api-key": API_KEY,
    },
  });

  return response.json() as Promise<BibleBookJson>;
};

export const fetchChapters = async (bookId: string) => {
  const response = await fetch(`${BASE_URL}/books/${bookId}/chapters`, {
    headers: {
      "api-key": API_KEY,
    },
  });

  return response.json() as Promise<BibleChaptersResponse>;
};
