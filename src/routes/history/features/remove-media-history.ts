import type {ApiError} from '@/core/types/api-error';
import {deleteMediaHistory} from '../infrastructure/history';

export const removeMediaHistory = async (id: number): Promise<{id: number} | ApiError> => {
  const res = await deleteMediaHistory(id);
  if (res !== 1) return {error: 'Media history not found', status: 404};

  return {id};
};
