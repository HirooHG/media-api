import type {Media} from '../domain/media';

export interface GetAllMediasResult {
  medias: Media[];
  pagination: {
    lastPage: number;
  };
}
