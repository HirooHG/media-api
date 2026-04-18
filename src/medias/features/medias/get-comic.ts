import type {ApiError} from '../../../models/api-error';
import {getComickComicDetails} from '../../application/com/application';
import {getMedia, setMedia} from '../../infrastructure/medias';
import type {Media} from '../../models/domain/media';
import {mediaDetailsComSchema} from '../../models/responses/com/media-com-schema';

export const getComic = async (id: number): Promise<Media | ApiError> => {
  const media = await getMedia({id});
  if (media === null) return {error: "Couldn't find the media", status: 404};
  if (media.detailled) return media;

  const mDetails = await getComickComicDetails(media.slug);
  const mediaDetails = mediaDetailsComSchema.safeParse(mDetails);

  if (!mediaDetails.success)
    throw new Error('Failed parsing details for comic ' + media.id + ': ' + mediaDetails.error);

  const {data} = mediaDetails;
  const newMedia: Media = {
    ...media,
    hid: data.hid,
    country: data.country,
    description: data.desc,
    demographic_name: data.demographic_name,
    origination: data.origination,
  };

  newMedia.detailled = true;

  await setMedia(id, newMedia);
  return newMedia;
};
