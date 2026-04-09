/// DATABASE
// Only communicate with mongo database

import {MongoClient} from 'mongodb';

const DB_HOST = process.env.DB_HOST ?? 'localhost:27017';

const client = new MongoClient('mongodb://' + DB_HOST);
const db = client.db('media-db');

export const api_auth = db.collection('api-auths');
export const app_auth = db.collection('app-auths');
export const chapters = db.collection('chapters');
export const medias = db.collection('media');

/// Client
export const initClient = async () => {
  await client.connect();
};

export const closeClient = async () => {
  await client.close();
};
