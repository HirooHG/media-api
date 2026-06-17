import {z} from 'zod';

export const chapterIdSchema = z.object({
  chapterId: z.coerce.number().int(),
});

export const chapterHidSchema = z.object({
  chapterHid: z.string(),
});
