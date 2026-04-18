import type {ApiError} from '../../../models/api-error';
import {getComickFollows} from '../../application/com/application';
import {getMedias, insertManyMedias} from '../../infrastructure/medias';
import type {Media} from '../../models/domain/media';
import {getAllComics} from './get-all-comics';
import {ObjectId} from 'mongodb';
import {mediaComSchema, type MediaComDto} from '../../models/responses/com/media-com-schema';

export const refreshComickFollows = async (
  page: number,
  per_page: number,
  status: number | null,
): Promise<Media[] | ApiError> => {
  const [em, m] = await Promise.all([getMedias(), getComickFollows()]);

  const mm = m.map((v) => {
    const obj = mediaComSchema.safeParse(v);

    if (!obj.success) throw new Error('Error parsing media: ' + obj.error.message);

    return obj.data as MediaComDto;
  });

  const dtos = mm.filter(
    (me: MediaComDto) => !em.some((eme: Media) => me.comic_id === eme.comic_id),
  );

  if (dtos.length === 0) return await getAllComics(page, per_page, status);

  const c = await insertManyMedias(
    dtos.map(
      (v: MediaComDto) =>
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
