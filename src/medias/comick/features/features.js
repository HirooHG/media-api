/// FEATURES
/// assemble db and application
/// ready to use functions for router

const {
  getComickComicImage,
  saveComicImage,
  getComickFollows,
  getComickComicChapters,
  getComickComicDetails,
} = require('../application/application');

const {
  getMedia,
  getMediaById,
  getMedias,
  setMediaProp,
  setMedia,
  insertManyChapters,
  insertManyMedias,
  getMediaChapters,
} = require('../model/db');

const {selectComicDetailsProps} = require('./utils');

// Home page
// if image in shimmer
// press button to fetch image from comick
const getComicImage = async (id) => {
  const m = await getMediaById(id);

  if (m === null) return {error: 'Media not found', status: 404};
  if (m.image) return m.image;

  const b = await getComickComicImage(m.default_thumbnail);
  const {status, image} = await saveComicImage(b, m.comic_id);
  if (!status) return {error: "Couldn't save the image", status: 500};

  await setMediaProp(m.comic_id, 'image', image);

  return image;
};

// Home page
// get list of media
const getAllComics = async (page, per_page) => {
  return await getMedias(undefined, {_id: 0, id: 0}, per_page, page);
};

// Comic page
// get details of media
const getComic = async (comic_id) => {
  const comic = await getMedia({comic_id});
  if (comic === null) return {error: "Couldn't find the comic", status: 404};
  if (comic.detailled) return comic;

  const comicDetails = await getComickComicDetails(comic.comic_slug);
  const props = selectComicDetailsProps(comicDetails);
  const newComic = {
    ...comic,
    ...props,
  };

  let desc = newComic.desc;
  const i = newComic.desc.indexOf('\n');
  if (i) {
    desc = desc.slice(0, i);
  }
  newComic.desc = desc;
  newComic.detailled = true;

  const replacedComic = await setMedia(comic_id, newComic);
  // risked to send _id
  replacedComic._id = null;

  return replacedComic;
};

// Home page
// press button refresh to update current list
const refreshComickFollows = async () => {
  const [em, m] = await Promise.all([getMedias(), getComickFollows()]);

  const nem = m.filter((me) => !em.some((eme) => me.comic_id === eme.comic_id));

  if (nem.length === 0) return;

  const c = await insertManyMedias(nem);
  if (c !== nem.length)
    return {error: 'Inserted ' + c + ' comic, expected ' + nem.length, status: 500};
};

// Chapter page
// press refresh button to actualise the chapter info
const getComickComicChapter = async (id) => {
  const c = await getMedia({comic_id: id});
  if (c === null) return {error: "Couldn't find the comic", status: 404};

  const existingChapters = await getMediaChapters(c.comic_id);
  if (existingChapters !== null) return existingChapters.chapters;

  const chs = await getComickComicChapters(c.comic_slug);
  if (chs.length === 0) return ch;

  const co = await insertManyChapters(c.comic_id, chs);
  if (!co) return {error: "Couldn't insert comic's chapters", status: 500};

  return chs;
};

module.exports = {
  getComicImage,
  getAllComics,
  getComic,
  refreshComickFollows,
  getComickComicChapter,
};
