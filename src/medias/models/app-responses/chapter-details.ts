import type {ChapterDto} from '../dto/chapter.dto';

export interface ChapterDetailsResponse {
  chapter: ChapterDto;
  dupGroupChapters: {
    id: number;
    hid: string;
    groupName: string;
  }[];
}
