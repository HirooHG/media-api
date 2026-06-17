import {z} from 'zod';

export const bookmarkIdSchema = z.object({
  id: z.uuid(),
});
