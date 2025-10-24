const {parse} = require('node-html-parser');
const fs = require('fs');

const {
  getMedias,
  insertManyMedias,
  getMedia,
  setMediaProp,
  insertManyChapters,
  getAuth,
} = require('../model/db');

const domain_ext = 'art';
const domain = 'https://comick.' + domain_ext;

const apiUri = domain + '/api';

const ONGOING = 1;
const COMPLETED = 2;
const CANCELLED = 3;
const HIATUS = 4;

const ifetch = async ({token}, uri) => {
  return await fetch(uri, {
    method: 'GET',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept':
        'image/webp,image/avif,image/jxl,image/heic,image/heic-sequence,video/*;q=0.8,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
      'Referer': domain,
    },
  });
};

const cfetch = async ({token}, uri) => {
  return await fetch(uri, {
    method: 'GET',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'application/json',
      'Referer': domain,
      'Authorization': 'Bearer ' + token,
    },
  });
};

const getFollows = async (creds) => {
  const m = [];
  const {identity} = creds;

  const u =
    apiUri +
    '/user/' +
    identity +
    '/follows?order_by=updated_at&order_direction=desc&page=1&per_page=100';
  const f = await cfetch(creds, u);
  const j = await f.json();
  m.push(...j.data);

  for (let i = 2; i <= j.last_page; i++) {
    const uri =
      apiUri +
      '/user/' +
      identity +
      '/follows?order_by=updated_at&order_direction=desc&page=' +
      i +
      '&per_page=100';
    const p = await cfetch(creds, uri);
    const js = await p.json();
    m.push(...js.data);
  }

  return m;
};

const updateFollows = async () => {
  const creds = await getAuth({domain: domain_ext});
  const em = await getMedias();
  const m = await getFollows(creds);

  const nem = m.filter((me) => !em.some((eme) => me.comic_id === eme.comic_id));

  return (await insertManyMedias(nem)).insertedCount;
};

const getAllMedias = async () => {
  return await getMedias();
};

const getMediasWithStatus = async (status) => {
  return await getMedias({comic_status: status});
};

const getChapters = async (creds, slug) => {
  const bu = apiUri + '/comics/' + slug + '/chapter-list?lang=en&page=';
  const cs = [];
  const ch = await (await cfetch(creds, bu + 1)).json();
  cs.push(...ch.data);

  for (let i = 2; i <= ch.last_page; i++) {
    const chh = await (await cfetch(creds, bu + i)).json();
    cs.push(...chh.data);
  }

  return cs;
};

const getChapterDetails = async (creds, slug, chapter) => {
  const u = domain + '/comic/' + slug + '/' + chapter.hid + '-chapter-' + chapter.chap + '-en';
  const t = await (await cfetch(creds, u)).text();
  const d = parse(t);
  const dt = d.getElementById('sv-data').innerText.trim();
  const da = JSON.parse(dt);
  return da.chapter;
};

const getComicImage = async (creds, uri) => {
  const i = await ifetch(creds, uri);
  return await i.blob();
};

const saveComicImage = async (creds, uri, id) => {
  const b = await getComicImage(creds, uri);
  const e = b.type.split('/')[1];
  const f = new File([b], id + '.' + e);
  const by = await f.bytes();

  const pr = new Promise((resolve, reject) => {
    fs.writeFile('./public/images/' + id + '.' + e, by, () => {
      reject(false);
    });
    resolve(true);
  });
  return await pr;
};

const updateComicChapter = async (id) => {
  const comic = await getMedia({comic_id: id});

  if (!comic) return;

  const creds = await getAuth({domain: domain_ext});
  const chapters = await getChapters(creds, comic.comic_slug);

  return await insertManyChapters(id, chapters);
};

module.exports = {
  getAllMedias,
  getMediasWithStatus,
  updateFollows,
  updateComicChapter,
};
