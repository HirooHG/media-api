import type {Media} from '../models/domain/media';
import type {ApiError} from '@/core/types/api-error';
import {getMediaById, setMediaProp} from '../infrastructure/medias';

export const modifyReadingStatus = async (
  mediaId: number,
  readingStatusId: string | null,
): Promise<Media | ApiError> => {
  const res = await setMediaProp<Media>(mediaId, 'readingStatus', readingStatusId);

  if (res.matchedCount !== 1) {
    return {
      error: 'Could not find media',
      status: 404,
    };
  }

  return (await getMediaById(mediaId))!;
};
