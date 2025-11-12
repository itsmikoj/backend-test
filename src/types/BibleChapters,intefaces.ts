export interface BibleChaptersResponse {
  data: Chapter[];
}

export interface Chapter {
  id: string;
  bibleId: string;
  bookId: string;
  number: string;
  reference: string;
}
