export interface BibleBookJson {
  data: BibleBook[];
}

export interface BibleBook {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
}

