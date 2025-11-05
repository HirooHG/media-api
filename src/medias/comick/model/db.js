/// DATABASE
// Only communicate with mongo database

const {MongoClient} = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('manga');
const auth = db.collection('auth');
const medias = db.collection('media');
const chapters = db.collection('chapters');

/// Medias
const getMedias = async (doc) => {
  return await medias.find(doc).toArray();
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

/// Chapters
const getMediaChapters = async (comic_id) => {
  return await chapters.findOne({comic_id});
};

const insertManyChapters = async (comic_id, chs) => {
  return (await chapters.insertOne({comic_id, chapters: chs})).acknowledged;
};

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
  // chapters
  insertManyChapters,
  getMediaChapters,
};
