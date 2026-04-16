/// APPLICATION
/// Only communicate with comick website

import type {Chapter} from '../../models/domain/chapter';

import {parse} from 'node-html-parser';
import fs from 'fs';

import {cfetch, ifetch} from './requests';

import {COM_DOMAIN, COM_URI, COM_API_URI} from '../../constants';
import {followsResponse} from '../../models/responses/com/follows';
import {
  chapterComDetailsSchema,
  type ChapterComDetailsDto,
} from '../../models/responses/com/chapter-details';
import {getAppAuth} from '../../infrastructure/app-auth';
import {comChapterListResponse} from '../../models/responses/com/chapter-list';
import {
  mediaDetailsComSchema,
  type MediaComDto,
  type MediaDetailsComDto,
} from '../../models/responses/com/media-com-schema';
import type {ChapterComDto} from '../../models/responses/com/chapter-com-schema';

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

export const getComickComicChapterDetails = async (
  slug: string,
  chapter: Chapter,
): Promise<ChapterComDetailsDto> => {
  const creds = await getAppAuth({domain: COM_DOMAIN});

  if (!creds) throw new Error('credentials unavailable');

  const {token} = creds;

  const url = COM_URI + '/comic/' + slug + '/' + chapter.hid + '-chapter-' + chapter.chap + '-en';
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

export const getComickImage = async (uri: string) => {
  const i = await ifetch(uri);

  if (!i.ok) throw Error(COMICK_ERROR);

  return await i.blob();
};
