import type {Document, WithId} from 'mongodb';
import type {MediaImage} from './media-image';

export type MediaReadingState = 'reading' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read';

export interface Media extends WithId<Document> {
  id: number;
  comic_id: number;
  type: MediaReadingState;
  comic_title: string;
  comic_slug: string;
  default_thumbnail: string;
  comic_last_chapter: string;
  image: MediaImage | undefined;
  hid: string;
  country: string | undefined;
  origination: string | undefined;
  chapter_count: number | undefined;
  demographic_name: string | undefined;
  desc: string | undefined;
  content_rating: string | undefined;
  detailled: boolean;
}
