import _ from 'lodash';
import type {ApiError} from '../../../models/api-error';
import {getComickComicChapters} from '../../application/com/application';
import {getMediaChapters, insertManyChapters} from '../../infrastructure/chapters';
import {getMedia} from '../../infrastructure/medias';
import type {Chapter} from '../../models/domain/chapter';
import {
  chapterDtoKeys,
  type ChapterDto,
  type ChapterWithComicIdDto,
} from '../../models/dto/chapter.dto';

export const refreshComicChapters = async (id: number): Promise<Chapter[] | ApiError> => {
  const c = await getMedia({comic_id: id});
  if (c === null) return {error: "Couldn't find the media", status: 404};

  const [ecs, chs] = await Promise.all([
    getMediaChapters(c.comic_id),
    getComickComicChapters(c.comic_slug),
  ]);
  const chapsToAdd = chs.filter((ch) => !ecs.some((ech) => ech.id === ch.id));
  if (chapsToAdd.length === 0) return ecs;

  const newChs = chapsToAdd.map((v) => {
    // TODO: try to change it to zod parsing
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
