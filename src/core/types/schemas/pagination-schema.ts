import {z} from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(0).optional().default(1),
  per_page: z.coerce.number().int().min(0).max(50).optional().default(5),
});

export const paginationWithStatusSchema = paginationSchema.and(
  z.object({
    status: z.coerce.number().int().min(0).max(5).optional().nullable().default(null),
  }),
);

export type PaginationDto = z.infer<typeof paginationSchema>;
export type PaginationWithStatusDto = z.infer<typeof paginationWithStatusSchema>;
