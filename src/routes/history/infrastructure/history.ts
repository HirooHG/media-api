import {mediaHistory} from '@/infrastructure/mongo';
import type {MediaHistory} from '../types/domain/media-history';

export const getMediaHistoric = async (limit: number) => {
  return (await mediaHistory.find().sort({timestamp: -1}).limit(limit).toArray()) as MediaHistory[];
};

export const getMediaHistory = async (mediaId: number) => {
  return (await mediaHistory.findOne({mediaId})) as MediaHistory | null;
};

export const createMediaHistory = async (history: MediaHistory) => {
  return (await mediaHistory.insertOne(history)).acknowledged;
};

export const updateMediaHistory = async (
  mediaId: number,
  timestamp: Date,
  chapter: string,
  chapterHid: string,
) => {
  return (await mediaHistory.updateOne({mediaId}, {$set: {timestamp, chapterHid, chapter}}))
    .modifiedCount;
};

export const deleteMediaHistory = async (mediaId: number) => {
  return (await mediaHistory.deleteOne({mediaId})).deletedCount;
};
