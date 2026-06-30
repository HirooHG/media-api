import {v4} from 'uuid';
import type {ReadingStatus} from '../types/domain/reading-status';
import type {ReadingSatusDto} from '../types/schema/reading-status-schema';
import {insertReadingStatus} from '../infrastructure/reading-status';
import type {ApiError} from '@/core/types/api-error';

export const createReadingStatus = async (
  dto: ReadingSatusDto,
): Promise<ReadingStatus | ApiError> => {
  const status: ReadingStatus = {
    id: v4(),
    label: dto.label,
  };

  const res = await insertReadingStatus(status);

  if (!res.acknowledged) {
    return {
      error: 'Could not insert status',
      status: 500,
    };
  }

  return status;
};
