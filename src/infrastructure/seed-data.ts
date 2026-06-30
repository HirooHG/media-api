import {mediaReadingStateSchema} from '@/application/com/types/media-com-schema';
import {
  getReadingStatuses,
  insertReadingStatus,
} from '@/routes/readingStatus/infrastructure/reading-status';
import {v4} from 'uuid';

export const seedReadingStatus = async () => {
  const statuses = await getReadingStatuses();
  if (statuses.length !== 0) return;

  for (const i of Object.values(mediaReadingStateSchema.enum)) {
    await insertReadingStatus({id: v4(), label: i});
  }
};

export const seedData = async () => {
  await seedReadingStatus();
};
