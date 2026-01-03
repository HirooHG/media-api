import type {Document, WithId} from 'mongodb';
import type {ChapterImage} from './chapter-image';

export interface Chapter extends WithId<Document> {
  id: string;
  hid: string;
  comic_id: number;
  chap: string;
  title: string | undefined;
  is_last_chapter: boolean;
  images: ChapterImage[];
  group_name: string[];
}
