import type {ApiError} from '../../../models/api-error';
import {deleteBookmark} from '../infrastructure/bookmark';

export const removeBookmark = async (id: string): Promise<{id: string} | ApiError> => {
  const res = await deleteBookmark(id);

  if (res !== 1) {
    return {
      error: res < 1 ? 'Bookmark not found' : 'Deleted ' + res + ' bookmarks',
      status: res < 1 ? 404 : 500,
    };
  }

  return {id};
};
