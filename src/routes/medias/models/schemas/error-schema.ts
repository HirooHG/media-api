import {z} from 'zod';

export const errorSchema = z.object({
  code: z.string(),
  message: z.string(),
  expected: z.string().optional(),
  received: z.string().optional(),
  type: z.string().optional(),
});

export const errorsSchema = z.array(errorSchema);
