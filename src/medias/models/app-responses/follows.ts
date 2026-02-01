import type {MediaDto} from '../dto/media.dto';
import type {Pagination} from './pagination';

export interface FollowsResponse extends Pagination {
  data: MediaDto[];
}
