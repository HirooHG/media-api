import {readingStatus} from '@/infrastructure/mongo';
import type {ReadingStatus} from '../types/domain/reading-status';
import type {WithId} from 'mongodb';

export const getReadingStatuses = async () => {
  return (await readingStatus.find().project({_id: 0}).toArray()) as WithId<ReadingStatus>[];
};

export const getReadingStatusById = async (id: string) => {
  return await readingStatus.findOne<ReadingStatus>({id}, {projection: {_id: 0}});
};

export const insertReadingStatus = async (status: ReadingStatus) => {
  return await readingStatus.insertOne(status);
};

export const deleteReadingStatus = async (id: string) => {
  return (await readingStatus.deleteOne({id})).deletedCount;
};
