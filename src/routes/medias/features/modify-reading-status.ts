import {getReadingStatusById} from '@/routes/readingStatus/infrastructure/reading-status';
import type {Media} from '../models/domain/media';
import type {ApiError} from '@/core/types/api-error';
import {getMediaById, setMediaProp} from '../infrastructure/medias';

export const modifyReadingStatus = async (
  mediaId: number,
  readingStatusId: string,
): Promise<Media | ApiError> => {
  const readingStatus = await getReadingStatusById(readingStatusId);

  if (!readingStatus) {
    return {
      error: 'Could not find readingStatus',
      status: 404,
    };
  }

  const res = await setMediaProp<Media>(mediaId, 'readingStatus', readingStatusId);

  if (res.matchedCount !== 1) {
    return {
      error: 'Could not find media',
      status: 404,
    };
  }

  return (await getMediaById(mediaId))!;
};
