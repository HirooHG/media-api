import type {Document, WithId} from 'mongodb';

export interface Bookmark extends WithId<Document> {
  id: string;
  mediaId: number;
  chapterId: number;
}
