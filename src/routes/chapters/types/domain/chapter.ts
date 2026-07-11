import type {Document, WithId} from 'mongodb';
import type {ChapterImage} from './chapter-image';

export interface ChapterTranslatorVersion {
  hid: string;
  title: string | null;
  images: ChapterImage[];
  translator?: string;
  next_chap?: string; // hid
  prev_chap?: string; // hid
}

export interface Chapter extends WithId<Document> {
  id: number;
  comic_id: number;
  chap: string;
  read: boolean;
  versions: ChapterTranslatorVersion[];
}
