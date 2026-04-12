import type {ApiError} from '../../../models/api-error';
import {getComickComicChapters} from '../../application/com/application';
import {getMediaChapters, insertManyChapters} from '../../infrastructure/chapters';
import {getMedia} from '../../infrastructure/medias';
import type {Chapter} from '../../models/domain/chapter';
import {ObjectId} from 'mongodb';
import {chapterComSchema} from '../../models/responses/com/chapter-com-schema';

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
    const parse = chapterComSchema.safeParse(v);

    if (!parse.success) throw new Error('Failed to parse chapter: ' + parse.error);

    const {data: cha} = parse;
    const chap: Chapter = {
      ...cha,
      _id: new ObjectId(),
      comic_id: c.comic_id,
      images: [],
    };
    return chap;
  });

  const ak = await insertManyChapters(newChs);
  if (!ak) return {error: "Couldn't insert media's chapters", status: 500};

  const chapters = await getMediaChapters(id);
  return chapters;
};
