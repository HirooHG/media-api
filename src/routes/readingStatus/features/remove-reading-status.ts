import type {ApiError} from '@/core/types/api-error';
import {deleteReadingStatus} from '../infrastructure/reading-status';

export const removeReadingStatus = async (id: string): Promise<{id: string} | ApiError> => {
  const res = await deleteReadingStatus(id);

  if (res !== 1) {
    return {
      error: 'Status not found',
      status: 404,
    };
  }

  return {id};
};
