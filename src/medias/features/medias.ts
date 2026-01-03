/// FEATURES
/// assemble db and application
/// ready to use functions for router

import {
  getComickImage,
  getComickFollows,
  getComickComicDetails,
  saveImage,
  createDir,
} from '../application/com/application';

import type {Document, Filter} from 'mongodb';
import {
  getMedia,
  getMediaById,
  getMedias,
  setMediaProp,
  setMedia,
  insertManyMedias,
  getMediasPaginated,
} from '../database/medias';

import type {AppError} from '../models/shared/app-error';
import type {Media} from '../models/domain/media';
import {mediaDetailsDtoKeys, mediaDtoKeys, type MediaDto} from '../models/dto/media.dto';
import type {MediaImage} from '../models/domain/media-image';
import _ from 'lodash';

// Home/Media page
// if image in shimmer
// press button to fetch image from comick
export const getComicImage = async (id: number): Promise<MediaImage | AppError> => {
  const m = await getMediaById(id);

  if (m === null) return {error: 'Media not found', status: 404};
  if (m.image) return m.image;

  const b = await getComickImage(m.default_thumbnail);
  const dir = './public/images/medias/';
  createDir(dir, true);

  const {status, image} = await saveImage(b, m.comic_id, dir);
  if (!status) return {error: "Couldn't save the image", status: 500};

  const im: MediaImage = {
    comid_id: id,
    url: image,
  };
  const res = await setMediaProp(m.comic_id, 'image', im);
  if (!res) return {error: "Couldn't persist the media image", status: 500};

  return im;
};

// Home page
// get list of media
export const getAllComics = async (page: number, per_page: number, status: number | null) => {
  const doc: Filter<Document> | undefined =
    status !== undefined && status !== null ? {comic_status: status} : undefined;

  return await getMediasPaginated(doc, {_id: 0, id: 0}, per_page, page);
};

// Media page
// get details of media
export const getComic = async (id: number): Promise<Media | AppError> => {
  const media = await getMedia({comic_id: id});
  if (media === null) return {error: "Couldn't find the media", status: 404};
  if (media.detailled) return media;

  const mDetails = await getComickComicDetails(media.comic_slug);
  const mediaDetails = _.pick(mDetails, mediaDetailsDtoKeys);
  const newMedia: Media = {
    ...media,
    ...mediaDetails,
  };

  newMedia.detailled = true;

  await setMedia(id, newMedia);
  return newMedia;
};

// Home page
// press button refresh to update current list
export const refreshComickFollows = async (
  page: number,
  per_page: number,
  status: number | null,
): Promise<Media[] | AppError> => {
  const [em, m] = await Promise.all([getMedias(), getComickFollows()]);

  const mm = m.map((v) => {
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
