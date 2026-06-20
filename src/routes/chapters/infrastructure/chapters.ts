import type {Document} from 'mongodb';
import {chapters} from '../../../infrastructure/mongo';
import type {Chapter} from '../types/domain/chapter';

export const getMediaChapters = async (media_id: number): Promise<Chapter[]> => {
  return (await chapters.find({comic_id: media_id}).project({_id: 0}).toArray()) as Chapter[];
};

export const getMediaChapter = async (
  mediaId: number,
  chapterHid: string,
): Promise<Chapter | null> => {
  return await chapters.findOne<Chapter>(
    {'versions.hid': chapterHid, comic_id: mediaId},
    {projection: {_id: 0}},
  );
};

export const getChapterById = async (id: number) => {
  return (await chapters.findOne({id})) as Chapter | null;
};

export const insertManyChapters = async (chs: Chapter[]) => {
  return (await chapters.insertMany(chs)).acknowledged;
};

export const setChapterProp = async (id: number, prop: string, data: object) => {
  const obj: Document = {
    [prop]: data,
  };
  return (await chapters.updateOne({id}, {$set: obj})).upsertedCount;
};

export const setChapter = async (
  mediaId: number,
  chapterId: number,
  obj: Chapter,
): Promise<Chapter | null> => {
  return (await chapters.findOneAndReplace({comic_id: mediaId, id: chapterId}, obj, {
    projection: {_id: 0},
  })) as Chapter | null;
};
