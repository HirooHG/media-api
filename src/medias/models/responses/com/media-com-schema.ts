import {z} from 'zod';

export const mediaReadingStateSchema = z.enum([
  'reading',
  'completed',
  'on_hold',
  'dropped',
  'plan_to_read',
]);

export const mediaComSchema = z.object({
  id: z.int().min(0),
  comic_id: z.int().min(0),
  comic_title: z.string(),
  comic_slug: z.string().nonempty(),
  comic_status: z.int().min(0),
  type: mediaReadingStateSchema,
  default_thumbnail: z.string(),
});

export const mediaDetailsComSchema = z.object({
  hid: z.string(),
  country: z.string().optional(),
  origination: z.string().optional(),
  chapter_count: z.number().optional(),
  demographic_name: z.string().optional(),
  desc: z.string().optional(),
  content_rating: z.string().optional(),
});

export type MediaReadingState = z.infer<typeof mediaReadingStateSchema>;
export type MediaDetailsComDto = z.infer<typeof mediaDetailsComSchema>;
export type MediaComDto = z.infer<typeof mediaComSchema>;
