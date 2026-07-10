import type {MediaImage} from '@/routes/medias/models/domain/media-image';
import type {Document, WithId} from 'mongodb';

export interface MediaHistory extends WithId<Document> {
  mediaId: number;
  title: string;
  image?: MediaImage;
  timestamp: Date;
  chapterHid: string;
  chapter: string;
}
