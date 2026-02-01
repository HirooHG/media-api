/// DATABASE
// Only communicate with mongo database

import type {Document, Filter} from 'mongodb';
import {MongoClient} from 'mongodb';
import type {AppAuth, AppAuthDto} from '../models/shared/app-auth';

const DB_HOST = process.env.DB_HOST ?? 'localhost';

const client = new MongoClient('mongodb://' + DB_HOST + ':27017');
const db = client.db('media-db');
const app_auth = db.collection('app-auths');

export const chapters = db.collection('chapters');
export const medias = db.collection('media');

export const getAppAuth = async (doc: Filter<Document>): Promise<AppAuth | null> => {
  return await app_auth.findOne<AppAuth>(doc);
};

export const setAppAuth = async (appAuth: AppAuthDto) => {
  return await app_auth.updateOne({domain: appAuth.domain}, {$set: appAuth}, {upsert: true});
};

/// Client
export const initClient = async () => {
  await client.connect();
};

export const closeClient = async () => {
  await client.close();
};
