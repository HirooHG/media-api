/// DATABASE
// Only communicate with mongo database

import type {Document, Filter} from 'mongodb';
import {MongoClient} from 'mongodb';
import type {AppAuth} from '../models/shared/app-auth';

const DB_HOST = process.env.DB_HOST ?? 'localhost';

const client = new MongoClient('mongodb://' + DB_HOST + ':27017');
export const db = client.db('media-db');
const auth = db.collection('auth');

export const getAuth = async (doc: Filter<Document>): Promise<AppAuth | null> => {
  return await auth.findOne<AppAuth>(doc);
};

export const setAuth = async (appAuth: AppAuth) => {
  return await auth.updateOne({domain: appAuth.domain}, {$set: appAuth}, {upsert: true});
};

/// Client
export const initClient = async () => {
  await client.connect();
};

export const closeClient = async () => {
  await client.close();
};
