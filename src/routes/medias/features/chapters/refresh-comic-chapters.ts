import type {ApiError} from '../../../../models/api-error';
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

  const newChs: Chapter[] = [];
  for (const v of chapsToAdd) {
    const parse = chapterComSchema.safeParse(v);
    if (!parse.success) throw new Error('Failed to parse chapter: ' + parse.error);
    const {data: cha} = parse;

    const existingChap = newChs.find((c) => c.chap === cha.chap);

    if (!existingChap)
      newChs.push({
        _id: new ObjectId(),
        id: cha.id,
        chap: cha.chap,
        comic_id: c.id,
        versions: [
          {
            hid: cha.hid,
            title: cha.title,
            translator: cha.group_name.at(0),
            images: [],
          },
        ],
      } satisfies Chapter);
    else
      existingChap.versions.push({
        hid: cha.hid,
        title: cha.title,
        translator: cha.group_name.at(0),
        images: [],
      });
  }

  newChs.forEach((a) => {
    a.versions.forEach((v) => {
      const prev = newChs.find((n) =>
        !isNaN(Number(n.chap)) && !isNaN(Number(n.chap))
          ? parseInt(n.chap) === parseInt(n.chap) - 1
          : false,
      );
      const next = newChs.find((n) =>
        !isNaN(Number(n.chap)) && !isNaN(Number(n.chap))
          ? parseInt(n.chap) === parseInt(n.chap) + 1
          : false,
      );

      v.prev_chap = prev?.versions.find((n) => n.translator === v.translator)?.hid;
      v.next_chap = next?.versions.find((n) => n.translator === v.translator)?.hid;
    });
  });

  const ak = await insertManyChapters(newChs);
  if (!ak) return {error: "Couldn't insert media's chapters", status: 500};

  const chapters = await getMediaChapters(id);
  return chapters;
};
