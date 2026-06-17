import {getBookmarkByMediaId} from '../infrastructure/bookmark';
import type {Bookmark} from '../types/domain/bookmark';

export const getBookmarkByMedia = async (mediaId: number): Promise<Bookmark | null> => {
  return await getBookmarkByMediaId(mediaId);
};
