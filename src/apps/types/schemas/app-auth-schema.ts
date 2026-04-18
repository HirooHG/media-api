import {z} from 'zod';

export const authTypeSchema = z.enum(['com', 'man']);

export const appAuthSchema = z.object({
  type: authTypeSchema,
  token: z.string(),
  domain: z.optional(z.string()),
  identity: z.optional(z.string()),
});

export type AuthType = z.infer<typeof authTypeSchema>;
export type AppAuthDto = z.infer<typeof appAuthSchema>;
