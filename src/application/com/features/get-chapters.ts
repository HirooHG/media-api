import {getAppAuth} from '@/routes/apps/infrastructure/app-auth';
import {cfetch} from '../utils/requests';
import {COM_API_URI, COM_DOMAIN} from '@/core/constants';
import type {ChapterComDto} from '../types/chapter-com-schema';
import {comChapterListResponse} from '../types/chapter-list';

const COMICK_ERROR = 'Error with fetch comick, renew the token maybe';

export const getComickComicChapters = async (slug: string): Promise<ChapterComDto[]> => {
  const creds = await getAppAuth({domain: COM_DOMAIN});
  if (!creds) throw new Error('credentials unavailable');
  const {token} = creds;

  const bu = COM_API_URI + '/comics/' + slug + '/chapter-list?lang=en&page=';
  const cs: ChapterComDto[] = [];
  const res = await cfetch(token, bu + '1');
  if (!res.ok) throw Error(COMICK_ERROR);

  const page = await res.json();
  const ch = comChapterListResponse.safeParse(page);

  if (!ch.success) throw new Error('Failed to parse chapter dto: ' + ch.error.message);

  cs.push(...ch.data.data);

  for (let i = 2; i <= ch.data.pagination.last_page; i++) {
    const resPage = await cfetch(token, bu + i);

    if (!resPage.ok) throw new Error(COMICK_ERROR);

    const mediaPage = await resPage.json();
    const chapters = comChapterListResponse.safeParse(mediaPage);

    if (!chapters.success)
      throw new Error('Failed to parse chapter dto: ' + chapters.error.message);

    cs.push(...chapters.data.data);
  }

  return cs;
};
