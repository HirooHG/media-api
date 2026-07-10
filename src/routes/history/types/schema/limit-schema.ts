import {z} from 'zod';

export const limitSchema = z.object({
  limit: z.coerce.number().int().positive().max(200).optional().default(10),
});
