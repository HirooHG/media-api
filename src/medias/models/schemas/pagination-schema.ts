import {z} from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().min(0).optional(),
  per_page: z.coerce.number().min(0).max(50).optional(),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
