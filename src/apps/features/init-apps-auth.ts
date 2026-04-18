import {COM_DOMAIN, COM_IDENTITY, COM_TOKEN} from '../../medias/constants';
import {getAppAuth, setAppAuth} from '../infrastructure/app-auth';
import type {AppAuthDto} from '../types/schemas/app-auth-schema';

export const initComAuth = async () => {
  const domain = COM_DOMAIN;
  const token = COM_TOKEN;
  const identity = COM_IDENTITY;

  if (!domain || !token || !identity) {
    throw new Error('Token, domain or identity not provided');
  }

  const creds = await getAppAuth({domain});
  if (creds?.token !== token || creds?.identity !== identity || creds?.domain !== domain) {
    const appAuth: AppAuthDto = {
      type: 'com',
      token,
      identity,
      domain,
    };

    const res = await setAppAuth(appAuth);
    if (res.acknowledged) {
      console.log('replaced current token|domain|identity');
      return;
    }

    console.log('An error has occured replacing auth credentials');
    process.exit(1);
  }
};
