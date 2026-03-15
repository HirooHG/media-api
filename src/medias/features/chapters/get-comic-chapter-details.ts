import type {ApiError} from '../../../models/api-error';
import {
  createDir,
  getComickComicChapterDetails,
  getComickImage,
  saveImage,
} from '../../application/com/application';
import {getMediaChapter, setChapter} from '../../infrastructure/chapters';
import {getMedia} from '../../infrastructure/medias';
import type {Chapter} from '../../models/domain/chapter';
import type {ChapterImage} from '../../models/domain/chapter-image';

export const getComicChapterDetails = async (
  comic_id: number,
  chapter_id: number,
): Promise<Chapter | ApiError> => {
  const ch = await getMediaChapter(comic_id, chapter_id);
  if (!ch || ch === null) return {error: "Couldn't find the chapter", status: 404};

  // A chapter probably won't be updated, probability close to 0
  if (ch.images) return ch;

  const media = await getMedia({comic_id});
  if (!media) return {error: "Couldn't find the media", status: 404};

  const chDetails = await getComickComicChapterDetails(media.comic_slug, ch);
  if (!chDetails) return {error: "Couldn't fetch chapter details", status: 500};
  const {chapter} = chDetails;

  const localUri = './public/medias/' + comic_id + '/' + chapter.id + '/';
  createDir(localUri, true);

  const images: ChapterImage[] = [];
  for (let i = 0; i < chapter.images.length; i++) {
    const {url, name, id} = chapter.images[i]!;
    const im = await getComickImage(url);
    const {status, image} = await saveImage(im, i, localUri);
    if (!status)
      return {
        error:
          "Couldn't save image " + name + ' from chapter ' + chapter.id + ' of media ' + comic_id,
        status: 500,
      };

    images.push({
      id,
      url: image,
    });
  }

  const newCh: Chapter = {
    ...ch,
    images,
  };
  await setChapter(comic_id, chapter_id, newCh);

  return newCh;
};
