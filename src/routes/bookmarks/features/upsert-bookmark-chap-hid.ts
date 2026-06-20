import {v4} from 'uuid';
import {getBookmarkByMediaId, updateBookmarkChapterId} from '../infrastructure/bookmark';
import type {Bookmark} from '../types/domain/bookmark';
import type {ApiError} from '@/core/types/api-error';
import {ObjectId} from 'mongodb';
import {getMediaById} from '../../medias/infrastructure/medias';
import {getChapterById, getMediaChapter} from '@/routes/chapters/infrastructure/chapters';

export const upsertBookmarkChapHid = async (
  mediaId: number,
  chapterHid: string,
): Promise<Bookmark | ApiError> => {
  const media = await getMediaById(mediaId);
  const chapter = await getMediaChapter(mediaId, chapterHid);
  if (!media || !chapter)
    return {
      error: 'Media or Chapter not found',
      status: 404,
    };

  const existingBookmark = await getBookmarkByMediaId(mediaId);
  if (existingBookmark && existingBookmark.chapterId === chapter.id) return existingBookmark;
  const existingBookmarkChapter = await getChapterById(existingBookmark?.chapterId ?? 0);
  if (
    existingBookmark &&
    existingBookmarkChapter &&
    !isNaN(Number(existingBookmarkChapter.chap)) &&
    !isNaN(Number(chapter.chap)) &&
    parseInt(existingBookmarkChapter.chap) > parseInt(chapter.chap)
  )
    return existingBookmark;

  const bookmark: Bookmark = {
    _id: new ObjectId(),
    id: existingBookmark ? existingBookmark.id : v4(),
    mediaId,
    chapterId: chapter.id,
  };
  await updateBookmarkChapterId(bookmark);
  return bookmark;
};
