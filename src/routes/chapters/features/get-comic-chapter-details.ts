import {getComickComicChapterDetails} from '@/application/com/features/get-chapter-details';
import {getComickImage} from '@/application/com/features/get-comic-image';
import type {ApiError} from '@/core/types/api-error';
import {saveImage} from '@/infrastructure/minio';
import {getMedia} from '@/routes/medias/infrastructure/medias';
import {getMediaChapter, setChapter} from '../infrastructure/chapters';
import type {Chapter} from '../types/domain/chapter';
import type {ChapterImage} from '../types/domain/chapter-image';

export const getComicChapterDetails = async (
  mediaId: number,
  chapterHid: string, // hid
): Promise<Chapter | ApiError> => {
  const media = await getMedia({id: mediaId});
  if (!media) return {error: "Couldn't find the media", status: 404};

  // INFO: A chapter probably won't be updated, probability close to 0
  const chap = await getMediaChapter(mediaId, chapterHid);
  if (!chap || chap === null) return {error: "Couldn't find the chapter", status: 404};

  const version = chap.versions.find((v) => v.hid === chapterHid);
  if (!version) return {error: "Couldn't fetch chapter details", status: 404};
  if (version.images.length !== 0) return chap;

  const chapterDetails = await getComickComicChapterDetails(media.slug, chap.chap, version.hid);
  if (!chapterDetails) return {error: "Couldn't fetch chapter details", status: 500};

  const {chapter} = chapterDetails;
  const images: ChapterImage[] = [];
  for (let i = 0; i < chapter.images.length; i++) {
    const {url, name, h, w} = chapter.images[i]!;
    const im = await getComickImage(url);
    const {uri} = await saveImage('chapter', mediaId + '/' + chapterHid + '/' + i, im);

    images.push({
      h,
      w,
      name,
      uri,
    });
  }

  version.images = images;
  await setChapter(mediaId, chap.id, chap);

  return chap;
};
