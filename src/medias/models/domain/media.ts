import type {Document, WithId} from 'mongodb';
import type {MediaImage} from './media-image';
import type {MediaReadingState} from '../responses/com/media-com-schema';

export interface Media extends WithId<Document> {
  // gen
  id: number;
  title: string;
  slug: string;
  status: number;
  type: MediaReadingState;
  default_thumbnail: string;
  // details
  hid?: string;
  country?: string;
  origination?: string;
  chapter_count?: number;
  demographic_name?: string;
  description?: string;
  // computed
  image?: MediaImage;
  detailled: boolean;
}
