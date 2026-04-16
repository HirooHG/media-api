import {saveImage} from '../../../infrastructure/minio';
import type {ApiError} from '../../../models/api-error';
import {getComickImage} from '../../application/com/application';
import {getMediaById, setMediaProp} from '../../infrastructure/medias';
import type {MediaImage} from '../../models/domain/media-image';

export const getComicImage = async (id: number): Promise<MediaImage | ApiError> => {
  const m = await getMediaById(id);

  if (m === null) return {error: 'Media not found', status: 404};
  if (m.image) return m.image;

  const blob = await getComickImage(m.default_thumbnail);

  const {uri} = await saveImage('media', m.id.toString(), blob);

  const image: MediaImage = {
    media_id: id,
    uri,
  };
  const res = await setMediaProp(m.comic_id, 'image', image);
  if (!res) return {error: "Couldn't persist the media image", status: 500};

  return image;
};
