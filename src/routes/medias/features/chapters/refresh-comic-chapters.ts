import type {ApiError} from '../../../../models/api-error';
import {getComickComicChapters} from '../../application/com/application';
import {getMediaChapters, insertManyChapters, setChapter} from '../../infrastructure/chapters';
import {getMedia} from '../../infrastructure/medias';
import type {Chapter} from '../../models/domain/chapter';
import {ObjectId} from 'mongodb';
import {chapterComSchema} from '../../models/responses/com/chapter-com-schema';

const setPreviousNextChapters = (a: Chapter, chaps: Chapter[]) => {
  const chapStr = a.chap;
  if (isNaN(Number(chapStr))) {
    return;
  }
  const chap = parseInt(chapStr);

  a.versions.forEach((v) => {
    const prev = chaps.find((n) =>
      !isNaN(Number(n.chap)) ? parseInt(n.chap) === chap - 1 : false,
    );
    const next = chaps.find((n) =>
      !isNaN(Number(n.chap)) ? parseInt(n.chap) === chap + 1 : false,
    );

    v.prev_chap = prev?.versions.find((n) => n.translator === v.translator)?.hid;
    v.next_chap = next?.versions.find((n) => n.translator === v.translator)?.hid;
  });
};

export const refreshComicChapters = async (id: number): Promise<Chapter[] | ApiError> => {
  const c = await getMedia({id});
  if (c === null) return {error: "Couldn't find the media", status: 404};

  const [ecs, chs] = await Promise.all([getMediaChapters(c.id), getComickComicChapters(c.slug)]);
  const chapsToAdd = chs.filter(
    (ch) => !ecs.some((ech) => !ech.versions.some((v) => v.hid === ch.hid)),
  );
  if (chapsToAdd.length === 0) return ecs;

  const newChs: Chapter[] = [];
  for (const v of chapsToAdd) {
    const parse = chapterComSchema.safeParse(v);
    if (!parse.success) throw new Error('Failed to parse chapter: ' + parse.error);
    const {data: cha} = parse;

    const newExistingChap = newChs.find((c) => c.chap === cha.chap);
    if (newExistingChap) {
      newExistingChap.versions.push({
        hid: cha.hid,
        title: cha.title,
        translator: cha.group_name.at(0),
        images: [],
      });
      continue;
    }

    const existingChap = ecs.find(
      (c) => c.chap === v.chap && !c.versions.some((v) => v.hid === v.hid),
    );
    if (existingChap) {
      existingChap.versions.push({
        hid: cha.hid,
        title: cha.title,
        translator: cha.group_name.at(0),
        images: [],
      });
      const res = await setChapter(existingChap.comic_id, existingChap.id, existingChap);

      if (!res) throw new Error('Failed to set chapter ' + existingChap.id);
      continue;
    }

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
  }

  newChs.forEach((c) => setPreviousNextChapters(c, newChs));

  const newAddedChap = newChs.find((c) =>
    !isNaN(Number(c.chap))
      ? ecs.some((e) =>
          !isNaN(Number(e.chap)) ? parseInt(c.chap) - 1 === parseInt(e.chap) : false,
        )
      : false,
  );
  if (newAddedChap) {
    const lastAddedChap = ecs.find((c) =>
      !isNaN(Number(c.chap)) ? parseInt(c.chap) === parseInt(newAddedChap.chap) - 1 : false,
    )!;

    setPreviousNextChapters(newAddedChap, [lastAddedChap]);
    setPreviousNextChapters(lastAddedChap, [newAddedChap]);

    const chap = await setChapter(lastAddedChap.comic_id, lastAddedChap.id, lastAddedChap);

    if (!chap) throw new Error('Could not modify chapter: ' + lastAddedChap.id);
  }

  if (newChs.length > 0) {
    const ak = await insertManyChapters(newChs);
    if (!ak) return {error: "Couldn't insert media's chapters", status: 500};
  }

  const chapters = await getMediaChapters(id);
  return chapters;
};
