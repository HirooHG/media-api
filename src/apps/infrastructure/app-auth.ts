import type {Document, Filter} from 'mongodb';
import {app_auth} from '../../infrastructure/mongo';
import type {AppAuth} from '../types/domain/app-auth';
import type {AppAuthDto} from '../types/schemas/app-auth-schema';

export const getAppAuth = async (doc: Filter<Document>): Promise<AppAuth | null> => {
  return await app_auth.findOne<AppAuth>(doc);
};

export const replaceToken = async ({type, token}: AppAuthDto) => {
  return await app_auth.updateOne({type}, {$set: {token}}, {upsert: true});
};

export const setAppAuth = async (appAuth: AppAuthDto) => {
  return await app_auth.updateOne({domain: appAuth.domain}, {$set: appAuth}, {upsert: true});
};
