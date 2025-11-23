/// DATABASE
// Only communicate with mongo database

const {MongoClient} = require('mongodb');

const DB_HOST = process.env.DB_HOST ?? 'localhost';

const client = new MongoClient('mongodb://' + DB_HOST + ':27017');
const db = client.db('manga');
const auth = db.collection('auth');
const medias = db.collection('media');
const chapters = db.collection('chapters');

/// Medias
const getMedias = async (doc, proj, per_page, page = 1) => {
  let ms = medias
    .find(doc)
    .project(proj)
    .skip((per_page ?? 0) * (page - 1));
  if (per_page) ms = ms.limit(per_page);

  return await ms.toArray();
};

const getMedia = async (doc) => {
  return await medias.findOne(doc);
};

const getMediaById = async (id) => {
  return await medias.findOne({comic_id: id});
};

const getAuth = async (doc) => {
  return await auth.findOne(doc);
};

const insertManyMedias = async (m) => {
  return (await medias.insertMany(m)).insertedCount;
};

const setMediaProp = async (id, prop, data) => {
  const obj = {};
  obj[prop] = data;
  return (await medias.updateOne({comic_id: id}, {$set: obj})).upsertedCount;
};

const setMedia = async (id, obj) => {
  return await medias.findOneAndReplace({comic_id: id}, obj);
};

/// Chapters
const getMediaChapters = async (comic_id) => {
  return await chapters.find({comic_id}).toArray();
};

const getMediaChapter = async (comic_id, chapter_id) => {
  return await chapters.findOne({id: chapter_id, comic_id});
};

const insertManyChapters = async (chs) => {
  return (await chapters.insertMany(chs)).acknowledged;
};

const setChapterProp = async (id, prop, data) => {
  const obj = {};
  obj[prop] = data;
  return (await chapters.updateOne({id}, {$set: obj})).upsertedCount;
};

const setChapter = async (comic_id, chapter_id, obj) => {
  return await chapters.findOneAndReplace({comic_id, id: chapter_id}, obj);
};

/// Client
const initClient = async () => {
  await client.connect();
};

const closeClient = async () => {
  await client.close();
};

module.exports = {
  initClient,
  closeClient,
  getAuth,
  // medias
  getMedias,
  getMedia,
  getMediaById,
  insertManyMedias,
  setMediaProp,
  setMedia,
  // chapters
  insertManyChapters,
  getMediaChapters,
  getMediaChapter,
  setChapterProp,
  setChapter,
};
