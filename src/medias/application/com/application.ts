/// APPLICATION
/// Only communicate with comick website

import type {Chapter} from '../../models/domain/chapter';

import {parse} from 'node-html-parser';
import fs from 'fs';

import {cfetch, ifetch} from './requests';
import {getAuth} from '../../database/mongo';

import {COM_DOMAIN, COM_URI, COM_API_URI} from '../../constants';
import type {MediaDetailsDto, MediaDto} from '../../models/dto/media.dto';
import type {FollowsResponse} from '../../models/response/follows';
import type {ChapterListResponse} from '../../models/response/chapter-list';
import type {ChapterDto} from '../../models/dto/chapter.dto';
import type {ChapterDetailsResponse} from '../../models/response/chapter-details';

const COMICK_ERROR = 'Error with fetch comick, renew the token maybe';

export const getComickFollows = async (): Promise<MediaDto[]> => {
  const m: MediaDto[] = [];
  const creds = await getAuth({domain: COM_DOMAIN});
  if (!creds) throw new Error('credentials unavailable');
  const {identity, token} = creds;

  const u =
    COM_API_URI +
    '/user/' +
    identity +
    '/follows?order_by=updated_at&order_direction=desc&page=1&per_page=100';
  const f = await cfetch(token, u);
  if (!f.ok) {
    throw Error(COMICK_ERROR);
  }

  const j = (await f.json()) as FollowsResponse;
  m.push(...j.data);

  for (let i = 2; i <= j.last_page; i++) {
    const uri =
      COM_API_URI +
      '/user/' +
      identity +
      '/follows?order_by=updated_at&order_direction=desc&page=' +
      i +
      '&per_page=100';
    const p = await cfetch(token, uri);
    if (!p.ok) {
      break;
    }

    const js = (await p.json()) as any;
    m.push(...js.data);
  }

  return m;
};

export const getComickComicChapters = async (slug: string): Promise<ChapterDto[]> => {
  const creds = await getAuth({domain: COM_DOMAIN});
  if (!creds) throw new Error('credentials unavailable');
  const {token} = creds;

  const bu = COM_API_URI + '/comics/' + slug + '/chapter-list?lang=en&page=';
  const cs: ChapterDto[] = [];
  const res = await cfetch(token, bu + '1');
  if (!res.ok) {
    throw Error(COMICK_ERROR);
  }

  const ch = (await res.json()) as ChapterListResponse;
  cs.push(...ch.data);

  for (let i = 2; i <= ch.last_page; i++) {
    const chh = (await (await cfetch(token, bu + i)).json()) as ChapterListResponse;
    cs.push(...chh.data);
  }

  return cs;
};

export const getComickComicDetails = async (slug: string): Promise<MediaDetailsDto> => {
  const creds = await getAuth({domain: COM_DOMAIN});
  if (!creds) throw new Error('credentials unavailable');
  const {token} = creds;

  const u = COM_URI + '/comic/' + slug;
  const res = await cfetch(token, u);
  if (!res.ok) {
    throw Error(COMICK_ERROR);
  }
  const t = await res.text();
  const d = parse(t);
  const dt = d.getElementById('comic-data')?.innerText.trim();
  if (!dt) throw new Error('No data available for this comic');

  const da: MediaDetailsDto = JSON.parse(dt);
  return da;
};

export const getComickComicChapterDetails = async (
  slug: string,
  chapter: Chapter,
): Promise<ChapterDetailsResponse> => {
  const creds = await getAuth({domain: COM_DOMAIN});
  if (!creds) throw new Error('credentials unavailable');
  const {token} = creds;

  const u = COM_URI + '/comic/' + slug + '/' + chapter.hid + '-chapter-' + chapter.chap + '-en';
  const res = await cfetch(token, u);
  if (!res.ok) {
    throw Error(COMICK_ERROR);
  }
  const t = await res.text();
  const d = parse(t);
  const dt = d.getElementById('sv-data')?.innerText.trim();
  if (!dt) throw new Error('No data available for this comic');

  const da: ChapterDetailsResponse = JSON.parse(dt);
  return da;
};

export const getComickImage = async (uri: string) => {
  const i = await ifetch(uri);
  if (!i.ok) {
    throw Error(COMICK_ERROR);
  }
  return await i.blob();
};

export const saveImage = async (blob: Blob, id: number, uri: string) => {
  const e = blob.type.split('/')[1];
  const f = new File([blob], id + '.' + e);
  const by = await f.bytes();
  const u = id + '.' + e;

  const pr = new Promise<boolean>((resolve, rejects) => {
    fs.writeFile(uri + u, by, () => {
      rejects(false);
    });
    resolve(true);
  });
  const res = await pr;
  return {status: res, image: u};
};

export const createDir = (dir: string, recursive: boolean = false) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive});
  }
};
