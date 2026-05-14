import {z} from 'zod';

export const actions = ['images', 'chapters', 'hello'];
export const actionsEnum = z.enum(actions);

export const actionSchema = z.object({
  action: actionsEnum,
});

export const imagesSchema = actionSchema.and(
  z.object({
    mediaId: z.coerce.number().int(),
  }),
);

export const limitSchema = actionSchema.and(
  z.object({
    limit: z.number().min(0).max(100).nullable(),
  }),
);
