import {z} from 'zod';
import {chapterComWithImagesSchema} from './chapter-com-schema';

export const chapterComDetailsSchema = z.object({
  chapter: chapterComWithImagesSchema,
  dupGroupChapters: z.array(
    z.object({
      id: z.number(),
      hid: z.string(),
      groupName: z.string(),
    }),
  ),
});

export type ChapterComDetailsDto = z.infer<typeof chapterComDetailsSchema>;
