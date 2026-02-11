import {z} from 'zod';

export const refreshTokenSchema = z.object({
  username: z.string(),
  refreshToken: z.string().min(8), // not empty
});

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
