import type {Document, WithId} from 'mongodb';
import type {MediaImage} from './media-image';

export interface Media extends WithId<Document> {
  // gen
  id: number;
  title: string;
  slug: string;
  status: number;
  readingStatus: string | null;
  default_thumbnail: string;
  // details
  hid?: string;
  country?: string;
  origination?: string;
  demographic_name?: string;
  description?: string | null;
  // computed
  image?: MediaImage;
  detailled: boolean;
}
