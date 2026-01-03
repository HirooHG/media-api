export interface ChapterImageDto {
  id: number;
  name: string;
  url: string;
}

export interface ChapterDto {
  id: string;
  hid: string;
  chap: string;
  title: string | undefined;
  is_last_chapter: boolean;
  images: ChapterImageDto[];
  group_name: string[];
}

export interface ChapterWithComicIdDto extends ChapterDto {
  comic_id: number;
}

export const chapterDtoKeys = [
  'id',
  'hid',
  'chap',
  'title',
  'is_last_chapter',
  'images',
  'group_name',
];
