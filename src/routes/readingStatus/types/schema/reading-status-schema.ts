import {z} from 'zod';

export const readingStatusSchema = z.object({
  label: z.string().nonempty().max(50),
});

export type ReadingSatusDto = z.infer<typeof readingStatusSchema>;
