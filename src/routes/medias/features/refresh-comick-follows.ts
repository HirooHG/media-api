import {getAllComics} from './get-all-comics';
import {ObjectId} from 'mongodb';
import type {ApiError} from '@/core/types/api-error';
import {getComickFollows} from '@/application/com/features/get-follows';
import type {GetAllMediasResult} from '../models/result/get-all-medias-result';
import {getMedias, insertManyMedias} from '../infrastructure/medias';
import type {Media} from '../models/domain/media';

export const refreshComickFollows = async (
  page: number,
  per_page: number,
  status: number | null,
): Promise<GetAllMediasResult | ApiError> => {
  const [em, m] = await Promise.all([getMedias(), getComickFollows()]);
  const dtos = m.filter((me) => !em.some((eme: Media) => me.comic_id === eme.id));

  if (dtos.length === 0) return await getAllComics(page, per_page, status);

  const c = await insertManyMedias(
    dtos.map(
      (v) =>
        ({
          _id: new ObjectId(),
          id: v.comic_id,
          detailled: false,
          title: v.comic_title,
          slug: v.comic_slug,
          status: v.comic_status,
          type: v.type,
          default_thumbnail: v.default_thumbnail,
        }) satisfies Media,
    ),
  );
  if (c !== dtos.length)
    return {error: 'Inserted ' + c + ' comic, expected ' + dtos.length, status: 500};

  const medias = await getAllComics(page, per_page, status);
  return medias;
};
