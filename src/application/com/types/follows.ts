import {mediaComSchema} from './media-com-schema';
import {z} from 'zod';
import {comPaginationSchema} from './pagination';

export const followsResponse = z
  .object({
    data: z.array(mediaComSchema),
  })
  .and(comPaginationSchema);

export type FollowsResponse = z.infer<typeof followsResponse>;
