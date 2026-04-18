import {saveImage} from '../../../infrastructure/minio';
import type {ApiError} from '../../../models/api-error';
import {getComickComicChapterDetails, getComickImage} from '../../application/com/application';
import {getMediaChapter, setChapter} from '../../infrastructure/chapters';
import {getMedia} from '../../infrastructure/medias';
import type {Chapter} from '../../models/domain/chapter';
import type {ChapterImage} from '../../models/domain/chapter-image';

export const getComicChapterDetails = async (
  comic_id: number,
  chapter_id: number,
): Promise<Chapter | ApiError> => {
  const chap = await getMediaChapter(comic_id, chapter_id);
  if (!chap || chap === null) return {error: "Couldn't find the chapter", status: 404};

  // A chapter probably won't be updated, probability close to 0
  if (chap.images.length !== 0) return chap;

  const media = await getMedia({id: comic_id});

  if (!media) return {error: "Couldn't find the media", status: 404};

  const chapterDetails = await getComickComicChapterDetails(media.slug, chap);

  if (!chapterDetails) return {error: "Couldn't fetch chapter details", status: 500};

  const {chapter} = chapterDetails;

  const images: ChapterImage[] = [];
  for (let i = 0; i < chapter.images.length; i++) {
    const {url, name, h, w} = chapter.images[i]!;
    const im = await getComickImage(url);
    const {uri} = await saveImage('chapter', comic_id + '/' + chapter_id + '/' + i, im);

    images.push({
      h,
      w,
      name,
      uri,
    });
  }

  const newCh: Chapter = {
    ...chap,
    images,
  };
  await setChapter(comic_id, chapter_id, newCh);

  return newCh;
};
