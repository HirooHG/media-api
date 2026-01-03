import type {Document} from 'mongodb';
import type {Chapter} from '../models/domain/chapter';
import {db} from './mongo';
import type {ChapterDto} from '../models/dto/chapter.dto';

const chapters = db.collection('chapters');

export const getMediaChapters = async (comic_id: number): Promise<Chapter[]> => {
  return (await chapters.find({comic_id}).toArray()) as Chapter[];
};

export const getMediaChapter = async (
  comic_id: number,
  chapter_id: number,
): Promise<Chapter | null> => {
  return await chapters.findOne<Chapter>({id: chapter_id, comic_id});
};

export const insertManyChapters = async (chs: ChapterDto[]) => {
  return (await chapters.insertMany(chs)).acknowledged;
};

export const setChapterProp = async (id: number, prop: string, data: object) => {
  const obj = {} as Document;
  obj[prop] = data;
  return (await chapters.updateOne({id}, {$set: obj})).upsertedCount;
};

export const setChapter = async (
  comic_id: number,
  chapter_id: number,
  obj: Chapter,
): Promise<Chapter | null> => {
  return (await chapters.findOneAndReplace({comic_id, id: chapter_id}, obj)) as Chapter | null;
};
