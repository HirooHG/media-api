import type {MediaReadingState} from '../domain/media';

export interface MediaDto {
  id: number;
  comic_id: number;
  type: MediaReadingState;
  comic_title: string;
  comic_slug: string;
  default_thumbnail: string;
}

export interface MediaDetailsDto {
  hid: string;
  country: string | undefined;
  origination: string | undefined;
  last_chapter: number | undefined;
  chapter_count: number | undefined;
  demographic_name: string | undefined;
  desc: string | undefined;
  content_rating: string | undefined;
}

export const mediaDtoKeys = [
  'id',
  'comic_id',
  'type',
  'comic_title',
  'comic_slug',
  'default_thumbnail',
];

export const mediaDetailsDtoKeys = [
  'hid',
  'country',
  'origination',
  'last_chapter',
  'chapter_count',
  'demographic_name',
  'desc',
  'content_rating',
];
