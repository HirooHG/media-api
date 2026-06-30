import {getReadingStatuses} from '../infrastructure/reading-status';
import type {ReadingStatus} from '../types/domain/reading-status';

export const readReadingStatuses = async () => {
  return (await getReadingStatuses()) as ReadingStatus[];
};
