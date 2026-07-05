import type {ApiError} from '@/core/types/api-error';
import {getMedia} from '../infrastructure/medias';
import type {ReadingStatus} from '@/routes/readingStatus/types/domain/reading-status';
import {getReadingStatusById} from '@/routes/readingStatus/infrastructure/reading-status';

export const getMediaReadingStatus = async (
  id: number,
): Promise<ReadingStatus | null | ApiError> => {
  const media = await getMedia({id});
  if (media === null) return {error: "Couldn't find the media", status: 404};

  return !media.readingStatus ? null : await getReadingStatusById(media.readingStatus);
};
