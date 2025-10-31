export interface BibleByChapters {
  data: Data;
  meta: Meta;
}

export interface Data {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  reference: string;
  copyright: string;
  verseCount: number;
  content: string;
  next: Next;
  previous: Next;
}

export interface Next {
  id: string;
  number: string;
  bookId: string;
}

export interface Meta {
  fums: string;
  fumsId: string;
  fumsJsInclude: string;
  fumsJs: string;
  fumsNoScript: string;
}
