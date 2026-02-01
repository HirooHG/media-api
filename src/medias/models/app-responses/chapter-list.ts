import type {ChapterDto} from '../dto/chapter.dto';
import type {Pagination} from './pagination';

export interface ChapterListResponse {
  data: ChapterDto[];
  pagination: Pagination;
}
