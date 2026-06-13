import {replaceToken} from '../infrastructure/app-auth';
import type {AppAuthDto} from '../types/schemas/app-auth-schema';

export const replaceAppToken = async ({token, type}: AppAuthDto) => {
  const obj: AppAuthDto = {token, type};

  const res = await replaceToken(obj);

  if (res.modifiedCount === 0) throw new Error('Could not replace token');
};
