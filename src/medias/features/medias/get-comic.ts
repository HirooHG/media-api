import _ from 'lodash';
import type {ApiError} from '../../../models/api-error';
import {getComickComicDetails} from '../../application/com/application';
import {getMedia, setMedia} from '../../infrastructure/medias';
import type {Media} from '../../models/domain/media';
import {mediaDetailsComSchema} from '../../models/responses/com/media-com-schema';

export const getComic = async (id: number): Promise<Media | ApiError> => {
  const media = await getMedia({comic_id: id});
  if (media === null) return {error: "Couldn't find the media", status: 404};
  if (media.detailled) return media;

  const mDetails = await getComickComicDetails(media.comic_slug);
  const mediaDetails = mediaDetailsComSchema.safeParse(mDetails);

  if (!mediaDetails.success)
    throw new Error(
      'Failed parsing details for comic ' + media.comic_id + ': ' + mediaDetails.error,
    );

  const {data} = mediaDetails;
  const newMedia: Media = {
    description: data.desc,
    ...media,
    ...data,
  };

  newMedia.detailled = true;

  await setMedia(id, newMedia);
  return newMedia;
};
