import type {MediaDto} from '../dto/media.dto';

export interface FollowsResponse {
  last_page: number;
  data: MediaDto[];
}
