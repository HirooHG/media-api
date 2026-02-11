import {z} from 'zod';

export const userTokenDtoSchema = z.object({
  sub: z.string(), // _id
  role: z.string(),
  iat: z.number().transform((v) => new Date(v)),
  exp: z.number().transform((v) => new Date(v)),
});

export type UserTokenDto = z.infer<typeof userTokenDtoSchema>;
