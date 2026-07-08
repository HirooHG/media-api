import {ObjectId} from 'mongodb';
import type {ApiError} from '@/core/types/api-error';
import {getComickFollows} from '@/application/com/features/get-follows';
import type {GetAllMediasResult} from '../models/result/get-all-medias-result';
import {getMedias, insertManyMedias} from '../infrastructure/medias';
import type {Media} from '../models/domain/media';
import {getReadingStatuses} from '@/routes/readingStatus/infrastructure/reading-status';
import {readAllMedias} from './read-all-medias';

export const refreshComickFollows = async (
  page: number,
  per_page: number,
  status: number | null,
): Promise<GetAllMediasResult | ApiError> => {
  const [em, m, statuses] = await Promise.all([
    getMedias(),
    getComickFollows(),
    getReadingStatuses(),
  ]);
  const dtos = m.filter((me) => !em.some((eme: Media) => me.comic_id === eme.id));

  if (dtos.length === 0) return await readAllMedias(page, per_page, status);

  const medias: Media[] = [];
  for (const dto of dtos) {
    const readingStatus = statuses.find((s) => s.label === dto.type)?.id ?? null;
    const media: Media = {
      _id: new ObjectId(),
      id: dto.comic_id,
      detailled: false,
      title: dto.comic_title,
      slug: dto.comic_slug,
      status: dto.comic_status,
      default_thumbnail: dto.default_thumbnail,
      readingStatus,
    };
    medias.push(media);
  }
  const c = await insertManyMedias(medias);

  if (c !== dtos.length)
    return {error: 'Inserted ' + c + ' comic, expected ' + dtos.length, status: 500};

  return await readAllMedias(page, per_page, status);
};
