import type {ApiError} from '../../../models/api-error';
import {getMediaChapters} from '../../infrastructure/chapters';
import {getMedia} from '../../infrastructure/medias';
import type {Chapter} from '../../models/domain/chapter';

export const getComicChapters = async (id: number): Promise<Chapter[] | ApiError> => {
  const m = await getMedia({comic_id: id});
  if (m === null) return {error: "Couldn't find the media", status: 404};

  return await getMediaChapters(id);
};
