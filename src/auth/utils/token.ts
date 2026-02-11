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
  return await genToken(user, '15m');
};

export const getToken = async (user: User) => {
  return await genToken(user, '5m');
};

const genToken = async (user: User, duration: '5m' | '15m' | '30m' | '60m') => {
  return await new SignJWT({sub: user._id.toHexString(), role: user.role})
    .setProtectedHeader({alg: algo})
    .setIssuedAt()
    .setExpirationTime(duration)
    .sign(secret);
};
