import type {ApiError} from '../../../models/api-error';
import {getComickComicChapters} from '../../application/com/application';
import {getMediaChapters, insertManyChapters} from '../../infrastructure/chapters';
import {getMedia} from '../../infrastructure/medias';
import type {Chapter} from '../../models/domain/chapter';
import {ObjectId} from 'mongodb';
import {chapterComSchema} from '../../models/responses/com/chapter-com-schema';

export const refreshComicChapters = async (id: number): Promise<Chapter[] | ApiError> => {
  const c = await getMedia({id});
  if (c === null) return {error: "Couldn't find the media", status: 404};

  const [ecs, chs] = await Promise.all([getMediaChapters(c.id), getComickComicChapters(c.slug)]);
  const chapsToAdd = chs.filter((ch) => !ecs.some((ech) => ech.id === ch.id));
  if (chapsToAdd.length === 0) return ecs;

  const newChs = chapsToAdd.map((v) => {
    const parse = chapterComSchema.safeParse(v);

    if (!parse.success) throw new Error('Failed to parse chapter: ' + parse.error);

    const {data: cha} = parse;
    const chap: Chapter = {
      _id: new ObjectId(),
      id: cha.id,
      hid: cha.hid,
      chap: cha.chap,
      title: cha.title,
      translator: cha.group_name.at(0),
      comic_id: c.id,
      images: [],
    };
    return chap;
  });

  newChs.forEach((v) => {
    const prev = newChs.find((n) => n.chap === v.chap - 1 && n.translator === v.translator)?.id;
    const next = newChs.find((n) => n.chap === v.chap + 1 && n.translator === v.translator)?.id;

    v.prev_chap = prev;
    v.next_chap = next;
  });

  const ak = await insertManyChapters(newChs);
  if (!ak) return {error: "Couldn't insert media's chapters", status: 500};

  const chapters = await getMediaChapters(id);
  return chapters;
};
