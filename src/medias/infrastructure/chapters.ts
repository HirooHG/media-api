import type {Document} from 'mongodb';
import type {Chapter} from '../models/domain/chapter';
import {chapters} from '../../infrastructure/mongo';

export const getMediaChapters = async (media_id: number): Promise<Chapter[]> => {
  return (await chapters.find({comic_id: media_id}).project({_id: 0}).toArray()) as Chapter[];
};

export const getMediaChapter = async (
  comic_id: number,
  chapter_id: number,
): Promise<Chapter | null> => {
  return await chapters.findOne<Chapter>({id: chapter_id, comic_id}, {projection: {_id: 0}});
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
  comic_id: number,
  chapter_id: number,
  obj: Chapter,
): Promise<Chapter | null> => {
  return (await chapters.findOneAndReplace({comic_id, id: chapter_id}, obj, {
    projection: {_id: 0},
  })) as Chapter | null;
};
