/// FEATURES
/// assemble db and application
/// ready to use functions for router

const {
  getComickImage,
  saveComicImage,
  getComickFollows,
  getComickComicChapters,
  getComickComicDetails,
  getComickComicChapterDetails,
  saveImage,
  createDir,
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
  getMediaChapter,
  setChapter,
} = require('../model/db');

const {
  selectComicDetailsProps,
  selectComicChapterDetailsProps,
  selectComicChapterProps,
} = require('./utils');

// Home/Comic page
// if image in shimmer
// press button to fetch image from comick
const getComicImage = async (id) => {
  const m = await getMediaById(id);

  if (m === null) return {error: 'Media not found', status: 404};
  if (m.image) return m.image;

  const b = await getComickImage(m.default_thumbnail);
  const {status, image} = await saveComicImage(b, m.comic_id, './public/images/');
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

  newComic.detailled = true;

  const replacedComic = await setMedia(comic_id, newComic);
  // risked to send _id
  replacedComic._id = null;

  return replacedComic;
};

// Home page
// press button refresh to update current list
const refreshComickFollows = async (page, per_page) => {
  const [em, m] = await Promise.all([getMedias(), getComickFollows()]);

  const nem = m.filter((me) => !em.some((eme) => me.comic_id === eme.comic_id));

  if (nem.length === 0) return em;

  const c = await insertManyMedias(nem);
  if (c !== nem.length)
    return {error: 'Inserted ' + c + ' comic, expected ' + nem.length, status: 500};

  return await getAllComics(page, per_page);
};

// Comic page
// automatically get chapters when entering comic page
const getComicChapters = async (id, refresh = false) => {
  const c = await getMedia({comic_id: id});
  if (c === null) return {error: "Couldn't find the comic", status: 404};

  return await getMediaChapters(c.comic_id);
};

// Comic page
// refresh chapters with button
const refreshComicChapters = async (id) => {
  const c = await getMedia({comic_id: id});
  if (c === null) return {error: "Couldn't find the comic", status: 404};

  const [ecs, chs] = await Promise.all([
    getMediaChapters(c.comic_id),
    getComickComicChapters(c.comic_slug),
  ]);
  const chapsToAdd = chs.filter((ch) => !ecs.some((ech) => ech.id === ch.id));

  const newChs = chapsToAdd.map((cha) => {
    const props = selectComicChapterProps(cha);
    return {
      comic_id: c.comic_id,
      ...props,
    };
  });
  const ak = await insertManyChapters(newChs);
  if (!ak) return {error: "Couldn't insert comic's chapters", status: 500};

  return newChs;
};

// Chapter page
// press refresh button to actualise the chapter info
const getComicChapterDetails = async (comic_id, chapter_id) => {
  const ch = await getMediaChapter(comic_id, chapter_id);
  if (!ch || ch === null) return {error: "Couldn't find the chapter", status: 404};

  const {comic_slug} = await getMedia({comic_id});
  const chDetails = await getComickComicChapterDetails(comic_slug, ch);
  if (!chDetails) return {error: "Couldn't fetch chapter details", status: 500};

  const localUri = './public/images/' + comic_id + '/' + chDetails.id + '/';
  createDir(localUri, true);

  const imagesComick = selectComicChapterDetailsProps(chDetails.images);
  const images = [];
  for (const i in imagesComick) {
    const {url, name} = imagesComick[i];
    const im = await getComickImage(url);
    const {status, image} = await saveImage(im, i, localUri);
    if (!status)
      return {
        error:
          "Couldn't save image " + name + ' from chapter ' + chDetails.id + ' of comic ' + comic_id,
        status: 500,
      };

    images.push(image);
  }

  const newCh = {
    ...ch,
    images,
  };
  const chap = await setChapter(comic_id, chapter_id, newCh);
  if (chap === null) return {error: "Couldn't persist chapter images", status: 500};

  return newCh;
};

module.exports = {
  getComicImage,
  getAllComics,
  getComic,
  refreshComickFollows,
  getComicChapters,
  refreshComicChapters,
  getComicChapterDetails,
};
