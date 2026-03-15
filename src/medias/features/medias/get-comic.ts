import _ from 'lodash';
import type {ApiError} from '../../../models/api-error';
import {getComickComicDetails} from '../../application/com/application';
import {getMedia, setMedia} from '../../infrastructure/medias';
import type {Media} from '../../models/domain/media';
import {mediaDetailsDtoKeys} from '../../models/dto/media.dto';

export const getComic = async (id: number): Promise<Media | ApiError> => {
  const media = await getMedia({comic_id: id});
  if (media === null) return {error: "Couldn't find the media", status: 404};
  if (media.detailled) return media;

  const mDetails = await getComickComicDetails(media.comic_slug);
  // TODO: try to change it to zod parsing
  const mediaDetails = _.pick(mDetails, mediaDetailsDtoKeys);
  const newMedia: Media = {
    ...media,
    ...mediaDetails,
  };

  newMedia.detailled = true;

  await setMedia(id, newMedia);
  return newMedia;
};
