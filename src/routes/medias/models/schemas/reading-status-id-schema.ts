import {z} from 'zod';

export const readingStatusIdSchema = z.object({
  readingStatusId: z.string(),
});
