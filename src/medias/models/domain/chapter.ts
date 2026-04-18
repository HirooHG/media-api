import type {Document, WithId} from 'mongodb';
import type {ChapterImage} from './chapter-image';

export interface Chapter extends WithId<Document> {
  id: number;
  hid: string;
  comic_id: number;
  chap: number;
  title: string | null;
  images: ChapterImage[];
  translator?: string;
  next_chap?: number;
  prev_chap?: number;
}
