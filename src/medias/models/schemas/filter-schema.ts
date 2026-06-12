import {z} from 'zod';

export const filterSchema = z.object({
  filter: z.string().trim().toLowerCase(),
});
