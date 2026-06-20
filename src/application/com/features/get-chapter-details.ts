import {parse} from 'node-html-parser';
import {getAppAuth} from '@/routes/apps/infrastructure/app-auth';
import {cfetch} from '../utils/requests';
import {COM_DOMAIN, COM_URI} from '@/core/constants';
import {chapterComDetailsSchema, type ChapterComDetailsDto} from '../types/chapter-details';

const COMICK_ERROR = 'Error with fetch comick, renew the token maybe';

export const getComickComicChapterDetails = async (
  slug: string,
  chapter: string,
  chapterHid: string,
): Promise<ChapterComDetailsDto> => {
  const creds = await getAppAuth({domain: COM_DOMAIN});

  if (!creds) throw new Error('credentials unavailable');

  const {token} = creds;

  const url = COM_URI + '/comic/' + slug + '/' + chapterHid + '-chapter-' + chapter + '-en';
  const res = await cfetch(token, url);

  if (!res.ok) throw Error(COMICK_ERROR);

  const t = await res.text();
  const page = parse(t);
  const data = page.getElementById('sv-data')?.innerText.trim();

  if (!data) throw new Error('No data available for this comic');

  const parsedData = JSON.parse(data);
  const details = chapterComDetailsSchema.safeParse(parsedData);

  if (!details.success)
    throw new Error('Failed to parse chapter details: ' + details.error.message);

  return details.data;
};
