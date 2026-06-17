import {bookmarks} from '../../../infrastructure/mongo';
import type {Bookmark} from '../types/domain/bookmark';

export const getAllBookmarks = async () => {
  return (await bookmarks.find().project({_id: 0}).toArray()) as Bookmark[];
};

export const getBookmarkByChapterId = async (chapterId: number) => {
  return (await bookmarks.findOne({chapterId}, {projection: {_id: 0}})) as Bookmark | null;
};

export const getBookmarkByMediaId = async (mediaId: number) => {
  return (await bookmarks.findOne({mediaId}, {projection: {_id: 0}})) as Bookmark | null;
};

export const getBookmarkById = async (id: string) => {
  return (await bookmarks.findOne({id}, {projection: {_id: 0}})) as Bookmark | null;
};

export const insertBookmark = async (bookmark: Bookmark) => {
  return (await bookmarks.insertOne(bookmark)).acknowledged;
};

export const deleteBookmark = async (id: string) => {
  return (await bookmarks.deleteOne({id})).deletedCount;
};

export const updateBookmarkChapterId = async (bookmark: Bookmark) => {
  return (
    await bookmarks.updateOne(
      {id: bookmark.id},
      {$set: {chapterId: bookmark.chapterId, mediaId: bookmark.mediaId}},
      {upsert: true},
    )
  ).modifiedCount;
};
