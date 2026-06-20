import {z} from 'zod';

export const comPaginationSchema = z.object({
  current_page: z.number(),
  per_page: z.number(),
  last_page: z.number(),
  total: z.number(),
});

export type ComPagination = z.infer<typeof comPaginationSchema>;
