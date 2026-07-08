import {idSchema} from '@/core/types/schemas/id-schema';
import {z} from 'zod';

export const mediaIdAndChapterIdValidationSchema = idSchema.and(
  z.object({
    chapterHid: z.string().nonempty(),
  }),
);
