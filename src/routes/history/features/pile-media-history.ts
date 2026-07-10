import type {ApiError} from '@/core/types/api-error';
import {createMediaHistory, getMediaHistory, updateMediaHistory} from '../infrastructure/history';
import {ObjectId} from 'mongodb';
import {getMediaById} from '@/routes/medias/infrastructure/medias';
import type {MediaHistory} from '../types/domain/media-history';
import {getMediaChapter} from '@/routes/chapters/infrastructure/chapters';

export const pileMediaHistory = async (
  id: number,
  chapterHid: string,
): Promise<MediaHistory | ApiError> => {
  const media = await getMediaById(id);
  if (!media) return {error: 'Media not found', status: 404};
  const chapter = await getMediaChapter(id, chapterHid);
  if (!chapter) return {error: 'Chapter not found', status: 404};

  const history = await getMediaHistory(id);
  if (!history) {
    const newHistory: MediaHistory = {
      _id: new ObjectId(),
      title: media.title,
      image: media.image,
      mediaId: id,
      chapterHid,
      chapter: chapter.chap,
      timestamp: new Date(),
    };
    const created = await createMediaHistory(newHistory);
    return created ? newHistory : {error: 'Could not create history', status: 500};
  }

  const timestamp = new Date();
  const res = await updateMediaHistory(id, timestamp, chapter.chap, chapterHid);
  if (res !== 1) return {error: 'Could not modify history', status: 500};

  return {...history, timestamp};
};
