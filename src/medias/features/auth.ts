import {ObjectId} from 'mongodb';
import {COM_TOKEN, COM_IDENTITY, COM_DOMAIN} from '../constants';
import {setAuth, getAuth} from '../database/mongo';
import type {AppAuth} from '../models/shared/app-auth';

export const initAuth = async () => {
  const domain = COM_DOMAIN;
  const token = COM_TOKEN;
  const identity = COM_IDENTITY;

  if (!domain || !token || !identity) {
    throw new Error('Token, domain or identity not provided');
  }

  const creds = await getAuth({domain});
  if (creds?.token !== token || creds?.identity !== identity || creds?.domain !== domain) {
    const appAuth: AppAuth = {
      _id: new ObjectId(),
      type: 'com',
      token,
      identity,
      domain,
    };

    const res = await setAuth(appAuth);
    if (res.acknowledged && res.upsertedCount !== 0) {
      console.log('replaced current token|domain|identity');
      return;
    }

    console.log('An error has occured replacing auth credentials');
    process.exit(1);
  }
};
