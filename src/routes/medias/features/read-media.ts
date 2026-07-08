import type {ApiError} from '@/core/types/api-error';
import {getComickComicDetails} from '@/application/com/features/get-comic-details';
import {getMedia, setMedia} from '../infrastructure/medias';
import type {Media} from '../models/domain/media';

export const readMedia = async (id: number): Promise<Media | ApiError> => {
  const media = await getMedia({id});
  if (media === null) return {error: "Couldn't find the media", status: 404};
  if (media.detailled) return media;

  const details = await getComickComicDetails(media.slug);

  const newMedia: Media = {
    ...media,
    hid: details.hid,
    country: details.country,
    description: details.desc,
    demographic_name: details.demographic_name,
    origination: details.origination,
  };

  newMedia.detailled = true;

  await setMedia(id, newMedia);
  return newMedia;
};
