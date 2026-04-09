import {z} from 'zod';

export const comicIdValidationSchema = z.object({
  id: z.coerce.number().int().min(0),
});

export const comicIdAndChapterIdValidationSchema = comicIdValidationSchema.and(
  z.object({
    chapterId: z.coerce.number().int().min(0),
  }),
);
