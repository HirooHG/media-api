import {z} from 'zod';

export const userLoginDtoSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type UserDto = z.infer<typeof userLoginDtoSchema>;
