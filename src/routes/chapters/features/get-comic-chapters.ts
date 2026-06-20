import type {ApiError} from '@/core/types/api-error';
import {getMedia} from '@/routes/medias/infrastructure/medias';
import {getMediaChapters} from '../infrastructure/chapters';
import type {Chapter} from '../types/domain/chapter';

export const getComicChapters = async (id: number): Promise<Chapter[] | ApiError> => {
  const m = await getMedia({id});
  if (m === null) return {error: "Couldn't find the media", status: 404};

  return await getMediaChapters(id);
};
