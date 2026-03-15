import type {Document, Filter} from 'mongodb';
import type {AppAuth, AppAuthDto} from '../models/shared/app-auth';
import {app_auth} from '../../infrastructure/mongo';

export const getAppAuth = async (doc: Filter<Document>): Promise<AppAuth | null> => {
  return await app_auth.findOne<AppAuth>(doc);
};

export const setAppAuth = async (appAuth: AppAuthDto) => {
  return await app_auth.updateOne({domain: appAuth.domain}, {$set: appAuth}, {upsert: true});
};
