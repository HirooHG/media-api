import _ from 'lodash';
import type {ApiError} from '../../../models/api-error';
import {getComickFollows} from '../../application/com/application';
import {getMedias, insertManyMedias} from '../../infrastructure/medias';
import type {Media} from '../../models/domain/media';
import {mediaDtoKeys, type MediaDto} from '../../models/dto/media.dto';
import {getAllComics} from './get-all-comics';

export const refreshComickFollows = async (
  page: number,
  per_page: number,
  status: number | null,
): Promise<Media[] | ApiError> => {
  const [em, m] = await Promise.all([getMedias(), getComickFollows()]);

  const mm = m.map((v) => {
    // TODO: try to change it to zod parsing
    return _.pick(v, mediaDtoKeys) as MediaDto;
  });

  const dtos = mm.filter((me: MediaDto) => !em.some((eme: Media) => me.comic_id === eme.comic_id));

  if (dtos.length === 0) return em;

  const c = await insertManyMedias(dtos);
  if (c !== dtos.length)
    return {error: 'Inserted ' + c + ' comic, expected ' + dtos.length, status: 500};

  const medias = await getAllComics(page, per_page, status);
  return medias;
};
