/// APPLICATION
/// Only communicate with comick website

const {parse} = require('node-html-parser');
const fs = require('fs');

const {cfetch, ifetch} = require('./requests');
const {getAuth} = require('../model/db');

const {COM_DOMAIN, COM_URI, COM_API_URI} = require('../constants');

const COMICK_ERROR = 'Error with fetch comick, renew the token maybe';

const getComickFollows = async () => {
  const m = [];
  const {identity, token} = await getAuth({domain: COM_DOMAIN});

  const u =
    COM_API_URI +
    '/user/' +
    identity +
    '/follows?order_by=updated_at&order_direction=desc&page=1&per_page=100';
  const f = await cfetch(token, u);
  if (!f.ok) {
    throw Error(COMICK_ERROR);
  }

  const j = await f.json();
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

    const js = await p.json();
    m.push(...js.data);
  }

  return m;
};

const getComickComicChapters = async (slug) => {
  const {token} = await getAuth({domain: COM_DOMAIN});
  const bu = COM_API_URI + '/comics/' + slug + '/chapter-list?lang=en&page=';
  const cs = [];
  const res = await cfetch(token, bu + 1);
  if (!res.ok) {
    throw Error(COMICK_ERROR);
  }

  const ch = await res.json();
  cs.push(...ch.data);

  for (let i = 2; i <= ch.last_page; i++) {
    const chh = await (await cfetch(token, bu + i)).json();
    cs.push(...chh.data);
  }

  return cs;
};

const getComickComicDetails = async (slug) => {
  const {token} = await getAuth({domain: COM_DOMAIN});
  const u = COM_URI + '/comic/' + slug;
  const res = await cfetch(token, u);
  if (!res.ok) {
    throw Error(COMICK_ERROR);
  }
  const t = await res.text();
  const d = parse(t);
  const dt = d.getElementById('comic-data').innerText.trim();
  const da = JSON.parse(dt);
  return da;
};

const getComickComicChapterDetails = async (slug, chapter) => {
  const {token} = await getAuth({domain: COM_DOMAIN});
  const u = COM_URI + '/comic/' + slug + '/' + chapter.hid + '-chapter-' + chapter.chap + '-en';
  const res = await cfetch(token, u);
  if (!res.ok) {
    throw Error(COMICK_ERROR);
  }
  const t = await res.text();
  const d = parse(t);
  const dt = d.getElementById('sv-data').innerText.trim();
  const da = JSON.parse(dt);
  return da.chapter;
};

const getComickImage = async (uri) => {
  const i = await ifetch(uri);
  if (!i.ok) {
    throw Error(COMICK_ERROR);
  }
  return await i.blob();
};

const saveImage = async (blob, id, uri) => {
  const e = blob.type.split('/')[1];
  const f = new File([blob], id + '.' + e);
  const by = await f.bytes();
  const u = id + '.' + e;

  const pr = new Promise((resolve, rejects) => {
    fs.writeFile(uri + u, by, () => {
      rejects();
    });
    resolve();
  });
  let res = false;
  try {
    await pr;
    res = true;
  } catch (e) {
    res = false;
  }
  return {status: res, image: u};
};

const createDir = (dir, recursive = false) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive});
  }
};

module.exports = {
  getComickFollows,
  getComickImage,
  getComickComicDetails,
  getComickComicChapters,
  getComickComicChapterDetails,
  saveImage,
  createDir,
};
