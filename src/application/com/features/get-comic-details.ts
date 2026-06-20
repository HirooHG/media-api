import {parse} from 'node-html-parser';
import {getAppAuth} from '@/routes/apps/infrastructure/app-auth';
import {cfetch} from '../utils/requests';
import {COM_DOMAIN, COM_URI} from '@/core/constants';
import {mediaDetailsComSchema, type MediaDetailsComDto} from '../types/media-com-schema';

const COMICK_ERROR = 'Error with fetch comick, renew the token maybe';

export const getComickComicDetails = async (slug: string): Promise<MediaDetailsComDto> => {
  const creds = await getAppAuth({domain: COM_DOMAIN});
  if (!creds) throw new Error('credentials unavailable');
  const {token} = creds;

  const u = COM_URI + '/comic/' + slug;
  const res = await cfetch(token, u);

  if (!res.ok) throw Error(COMICK_ERROR);

  const t = await res.text();
  const d = parse(t);
  const dt = d.getElementById('comic-data')?.innerText.trim();

  if (!dt) throw new Error('No data available for this comic');

  const da = JSON.parse(dt);
  const details = mediaDetailsComSchema.safeParse(da);

  if (!details.success) throw new Error('Failed parse media details: ' + details.error.message);

  return details.data;
};
