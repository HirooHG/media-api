import type {ChapterDto} from '../dto/chapter.dto';

export interface ChapterListResponse {
  last_page: number;
  data: ChapterDto[];
}
