import {getAppAuth} from '@/routes/apps/infrastructure/app-auth';
import {cfetch} from '../utils/requests';
import {followsResponse} from '../types/follows';
import {COM_API_URI, COM_DOMAIN} from '@/core/constants';
import type {MediaComDto} from '../types/media-com-schema';

const COMICK_ERROR = 'Error with fetch comick, renew the token maybe';

export const getComickFollows = async (): Promise<MediaComDto[]> => {
  const m: MediaComDto[] = [];
  const creds = await getAppAuth({domain: COM_DOMAIN});

  if (!creds) throw new Error('credentials unavailable');

  const {identity, token} = creds;

  const u =
    COM_API_URI +
    '/user/' +
    identity +
    '/follows?order_by=updated_at&order_direction=desc&page=1&per_page=100';
  const f = await cfetch(token, u);
  if (!f.ok) throw Error(COMICK_ERROR);

  const j = await f.json();
  const follows = followsResponse.safeParse(j);

  if (!follows.success) throw new Error('Failed to parse follows: ' + follows.error.message);

  m.push(...follows.data.data);

  for (let i = 2; i <= follows.data.last_page; i++) {
    const uri =
      COM_API_URI +
      '/user/' +
      identity +
      '/follows?order_by=updated_at&order_direction=desc&page=' +
      i +
      '&per_page=100';
    const p = await cfetch(token, uri);
    if (!p.ok) throw new Error(COMICK_ERROR);

    const js = await p.json();
    const follows = followsResponse.safeParse(js);

    if (!follows.success) throw new Error('Failed to parse follows: ' + follows.error.message);

    m.push(...follows.data.data);
  }

  return m;
};
