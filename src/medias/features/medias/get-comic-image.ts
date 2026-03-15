import type {ApiError} from '../../../models/api-error';
import {createDir, getComickImage, saveImage} from '../../application/com/application';
import {getMediaById, setMediaProp} from '../../infrastructure/medias';
import type {MediaImage} from '../../models/domain/media-image';

export const getComicImage = async (id: number): Promise<MediaImage | ApiError> => {
  const m = await getMediaById(id);

  if (m === null) return {error: 'Media not found', status: 404};
  if (m.image) return m.image;

  const b = await getComickImage(m.default_thumbnail);
  const dir = './public/medias/';
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
