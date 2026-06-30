import {z} from 'zod';

export const uuidSchema = z.object({
  id: z.uuidv4(),
});
