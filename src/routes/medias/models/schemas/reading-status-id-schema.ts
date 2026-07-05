import {z} from 'zod';

export const readingStatusIdSchema = z.object({
  readingStatusId: z.uuidv4().nullable(),
});
