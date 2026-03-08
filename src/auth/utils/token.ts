import {SignJWT} from 'jose';
import type {User} from '../models/domain/user';

export const algo =
  process.env.JWT_ALGO ??
  (() => {
    console.error('JWT algo expected');
    process.exit(1);
  })();

export const sec =
  process.env.JWT_SECRET ??
  (() => {
    console.error('JWT secret expected');
    process.exit(1);
  })();

const secret = new TextEncoder().encode(sec);

export const getRefreshToken = async (user: User) => {
  return await genToken(user, '60 minutes');
};

export const getToken = async (user: User) => {
  return await genToken(user, '5 minutes');
};

const genToken = async (
  user: User,
  duration: '1 minutes' | '5 minutes' | '15 minutes' | '30 minutes' | '60 minutes',
) => {
  return await new SignJWT({sub: user._id.toHexString(), role: user.role})
    .setProtectedHeader({alg: algo})
    .setIssuedAt()
    .setExpirationTime(duration)
    .sign(secret);
};
