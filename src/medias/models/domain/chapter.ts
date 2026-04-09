import type {Document, WithId} from 'mongodb';
import type {ChapterImage} from './chapter-image';

export interface Chapter extends WithId<Document> {
  id: number;
  hid: string;
  comic_id: number;
  chap: string;
  title: string | null;
  is_last_chapter: boolean;
  images: ChapterImage[];
  group_name: string;
}
