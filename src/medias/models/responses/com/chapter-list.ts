import {z} from 'zod';
import {chapterComSchema} from './chapter-com-schema';
import {comPaginationSchema} from './pagination';

export const comChapterListResponse = z.object({
  data: z.array(chapterComSchema),
  pagination: comPaginationSchema,
});

export type ComChapterListResponse = z.infer<typeof comChapterListResponse>;
