import {v4} from 'uuid';
import {insertBookmark} from '../infrastructure/bookmark';
import type {Bookmark} from '../types/domain/bookmark';
import type {ApiError} from '../../../models/api-error';
import {ObjectId} from 'mongodb';
import {getMediaById} from '../../medias/infrastructure/medias';

export const createBookmark = async (
  mediaId: number,
  chapterId: number,
): Promise<Bookmark | ApiError> => {
  const media = await getMediaById(mediaId);
  if (!media)
    return {
      error: 'Media not found',
      status: 404,
    };

  const bookmark: Bookmark = {
    _id: new ObjectId(),
    id: v4(),
    mediaId,
    chapterId,
  };
  const res = await insertBookmark(bookmark);

  if (!res) {
    return {
      status: 500,
      error: 'Could not create bookmark',
    };
  }
  return bookmark;
};
