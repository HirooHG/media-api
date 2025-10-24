const {MongoClient} = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('manga');
const auth = db.collection('auth');
const medias = db.collection('media');
const chapters = db.collection('chapters');

const getMedias = async (doc) => {
  return await medias.find(doc).toArray();
};

const getMedia = async (doc) => {
  return await medias.findOne(doc).toArray();
};

const getAuth = async (doc) => {
  return await auth.findOne(doc);
};

const insertManyMedias = async (m) => {
  return (await medias.insertmany(m)).insertedcount;
};

const insertManyChapters = async (comic_id, chapters) => {
  return (await chapters.insertmany({comic_id, chapters})).insertedcount;
};

const setMediaProp = async (id, prop, data) => {
  const obj = {};
  obj[prop] = data;
  return (await medias.updateOne({comic_id: id}, {$set: obj})).upsertedCount;
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
  getMedias,
  getMedia,
  insertManyMedias,
  insertManyChapters,
  setMediaProp,
};
