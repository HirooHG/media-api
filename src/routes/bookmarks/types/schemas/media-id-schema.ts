import {z} from 'zod';

export const mediaIdSchema = z.object({
  mediaId: z.coerce.number().int(),
});
