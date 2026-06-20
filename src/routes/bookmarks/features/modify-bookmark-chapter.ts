import type {ApiError} from '@/core/types/api-error';
import {getBookmarkById, updateBookmarkChapterId} from '../infrastructure/bookmark';
import type {Bookmark} from '../types/domain/bookmark';
import {getChapterById} from '@/routes/chapters/infrastructure/chapters';

export const modifyBookmarkChapter = async (
  id: string,
  mediaId: number,
  chapterId: number,
): Promise<Bookmark | ApiError> => {
  const existingBookmark = await getBookmarkById(id);
  if (!existingBookmark) return {error: 'Bookmark not found', status: 404};
  const existingBookmarkChapter = await getChapterById(existingBookmark.chapterId);
  if (!existingBookmarkChapter) return {error: 'existing bookmark chapter not found', status: 404};
  const chapter = await getChapterById(chapterId);
  if (!chapter) return {error: 'chapter not found', status: 404};

  const newBookmark = {
    ...existingBookmark,
    chapterId,
    mediaId,
  };
  const res = await updateBookmarkChapterId(newBookmark);

  if (res < 1) {
    return {
      error: 'Less than 1 bookmark were updated',
      status: 500,
    };
  }

  return newBookmark;
};
