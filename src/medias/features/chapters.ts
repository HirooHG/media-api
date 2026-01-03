import type {AppError} from '../models/shared/app-error';
import type {Chapter} from '../models/domain/chapter';
import {
  chapterDtoKeys,
  type ChapterDto,
  type ChapterWithComicIdDto,
} from '../models/dto/chapter.dto';
import type {ChapterImage} from '../models/domain/chapter-image';

import {
  getComickImage,
  getComickComicChapters,
  getComickComicChapterDetails,
  saveImage,
  createDir,
} from '../application/com/application';

import {getMedia} from '../database/medias';

import {
  insertManyChapters,
  getMediaChapters,
  getMediaChapter,
  setChapter,
} from '../database/chapters';
import _ from 'lodash';

// Media page
// automatically get chapters when entering comic page
export const getComicChapters = async (id: number): Promise<Chapter[] | AppError> => {
  const m = await getMedia({comic_id: id});
  if (m === null) return {error: "Couldn't find the media", status: 404};

  return await getMediaChapters(id);
};

// Media page
// refresh chapters with button
export const refreshComicChapters = async (id: number): Promise<Chapter[] | AppError> => {
  const c = await getMedia({comic_id: id});
  if (c === null) return {error: "Couldn't find the media", status: 404};

  const [ecs, chs] = await Promise.all([
    getMediaChapters(c.comic_id),
    getComickComicChapters(c.comic_slug),
  ]);
  const chapsToAdd = chs.filter((ch) => !ecs.some((ech) => ech.id === ch.id));

  const newChs = chapsToAdd.map((v) => {
    const cha = _.pick(v, chapterDtoKeys) as ChapterDto;
    const chap: ChapterWithComicIdDto = {
      comic_id: c.comic_id,
      ...cha,
    };
    return chap;
  });

  const ak = await insertManyChapters(newChs);
  if (!ak) return {error: "Couldn't insert media's chapters", status: 500};

  const chapters = await getMediaChapters(id);
  return chapters;
};

// Chapter page
// press refresh button to actualise the chapter info
export const getComicChapterDetails = async (
  comic_id: number,
  chapter_id: number,
): Promise<Chapter | AppError> => {
  const ch = await getMediaChapter(comic_id, chapter_id);
  if (!ch || ch === null) return {error: "Couldn't find the chapter", status: 404};

  // A chapter probably won't be updated, probability close to 0
  if (ch.images) return ch;

  const media = await getMedia({comic_id});
  if (!media) return {error: "Couldn't find the media", status: 404};

  const chDetails = await getComickComicChapterDetails(media.comic_slug, ch);
  if (!chDetails) return {error: "Couldn't fetch chapter details", status: 500};
  const {chapter} = chDetails;

  const localUri = './public/images/medias/' + comic_id + '/' + chapter.id + '/';
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
