import {z} from 'zod';

export const patchChapterSchema = z.object({
  comic_id: z.number().optional(),
  chap: z.string().optional(),
  read: z.boolean().optional(),
});

export type PatchChapterDto = z.infer<typeof patchChapterSchema>;
