/// APPLICATION
/// Only communicate with comick website

const {parse} = require('node-html-parser');
const fs = require('fs');

const {cfetch, ifetch} = require('./requests');
const {getAuth} = require('../model/db');

const {DOMAIN_EXT, DOMAIN, API_URI} = require('../constants');

const getComickFollows = async () => {
  const m = [];
  const {identity, token} = await getAuth({domain: DOMAIN_EXT});

  const u =
    API_URI +
    '/user/' +
    identity +
    '/follows?order_by=updated_at&order_direction=desc&page=1&per_page=100';
  const f = await cfetch(token, u);
  const j = await f.json();
  m.push(...j.data);

  for (let i = 2; i <= j.last_page; i++) {
    const uri =
      API_URI +
      '/user/' +
      identity +
      '/follows?order_by=updated_at&order_direction=desc&page=' +
      i +
      '&per_page=100';
    const p = await cfetch(token, uri);
    const js = await p.json();
    m.push(...js.data);
  }

  return m;
};

const getComickComicChapters = async (slug) => {
  const {token} = await getAuth({domain: DOMAIN_EXT});
  const bu = API_URI + '/comics/' + slug + '/chapter-list?lang=en&page=';
  const cs = [];
  const ch = await (await cfetch(token, bu + 1)).json();
  cs.push(...ch.data);

  for (let i = 2; i <= ch.last_page; i++) {
    const chh = await (await cfetch(token, bu + i)).json();
    cs.push(...chh.data);
  }

  return cs;
};

const getComickComicDetails = async (slug) => {
  const {token} = await getAuth({domain: DOMAIN_EXT});
  const u = DOMAIN + '/comic/' + slug;
  const t = await (await cfetch(token, u)).text();
  const d = parse(t);
  const dt = d.getElementById('comic-data').innerText.trim();
  const da = JSON.parse(dt);
  return da;
};

const getChapterDetails = async (slug, chapter) => {
  const {token} = await getAuth({domain: DOMAIN_EXT});
  const u = DOMAIN + '/comic/' + slug + '/' + chapter.hid + '-chapter-' + chapter.chap + '-en';
  const t = await (await cfetch(token, u)).text();
  const d = parse(t);
  const dt = d.getElementById('sv-data').innerText.trim();
  const da = JSON.parse(dt);
  return da.chapter;
};

const getComickComicImage = async (uri) => {
  const i = await ifetch(uri);
  return await i.blob();
};

const saveComicImage = async (blob, id) => {
  const e = blob.type.split('/')[1];
  const f = new File([blob], id + '.' + e);
  const by = await f.bytes();
  const u = id + '.' + e;

  const pr = new Promise((resolve, rejects) => {
    fs.writeFile('./public/images/' + u, by, () => {
      rejects();
    });
    resolve();
  });
  let res = false;
  try {
    await pr;
    res = true;
  } catch (e) {
    console.log(e);
    res = false;
  }
  return {status: res, image: u};
};

module.exports = {
  getComickFollows,
  getComickComicImage,
  getChapterDetails,
  getComickComicDetails,
  getComickComicChapters,
  saveComicImage,
};
