import {z} from 'zod';

export const chapterComImageSchema = z.object({
  h: z.int(),
  w: z.int(),
  name: z.string().optional(),
  url: z.string(),
});

export const chapterComSchema = z.object({
  id: z.number(),
  hid: z.string(),
  chap: z.string(),
  vol: z.string().optional().nullable(),
  title: z.string().nullable(),
  group_name: z.string(),
  is_last_chapter: z.boolean().default(false),
});

export const chapterComWithImagesSchema = chapterComSchema.and(
  z.object({
    images: z.array(chapterComImageSchema),
  }),
);

export type ChapterComWithImagesDto = z.infer<typeof chapterComWithImagesSchema>;
export type ChapterComImageDto = z.infer<typeof chapterComImageSchema>;
export type ChapterComDto = z.infer<typeof chapterComSchema>;
