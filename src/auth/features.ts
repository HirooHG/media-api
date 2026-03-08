import {ObjectId} from 'mongodb';
import type {ApiError} from '../models/api-error';
import {getUserByName, getUsers, setUser} from './infrastructure';
import type {User} from './models/domain/user';
import type {AuthResult} from './models/result/auth-result';
import {encryptPassword, verifyPassword} from './utils/crypto';
import {getRefreshToken, getToken, sec} from './utils/token';
import type {UserDto} from './models/schemas/user-schema';
import type {RefreshTokenDto} from './models/schemas/refreshToken-schema';
import jwt, {type JwtPayload} from 'jsonwebtoken';

export const initAuth = async () => {
  const admin = process.env.ADMIN_NAME;
  const adminPwd = process.env.ADMIN_PWD;

  if (!admin || !adminPwd) {
    console.error('Admin name or pwd missing');
    process.exit(1);
  }

  const existingAdmin = await getUserByName(admin);

  if (!existingAdmin) {
    const hashedPwd = encryptPassword(adminPwd);
    const user: User = {
      _id: new ObjectId(),
      username: admin,
      hashedPwd,
      role: 'admin',
    };
    const res = await setUser(user);

    if (!res.acknowledged) {
      console.error("Couldn't insert admin");
      process.exit(1);
    }
  }
};

export const signIn = async (dto: UserDto): Promise<AuthResult | ApiError> => {
  const users = await getUsers();
  const user = users.find((u) => {
    return u.username === dto.username && verifyPassword(dto.password, u.hashedPwd);
  });

  if (user) {
    const token = await getToken(user);
    const refreshToken = await getRefreshToken(user);
    return {
      username: user.username,
      token,
      refreshToken,
    };
  }

  return {
    error: 'Login failed',
    status: 401,
  };
};

export const refreshToken = async (dto: RefreshTokenDto): Promise<AuthResult | ApiError> => {
  const user = await getUserByName(dto.username);
  if (!user) {
    return {
      error: 'User not found',
      status: 400,
    };
  }

  const pr = new Promise<{resolved: boolean; error?: string}>((resolve) => {
    jwt.verify(dto.refreshToken, sec, (err, decoded) => {
      const payload = decoded as JwtPayload | undefined;
      const isTheUser = payload?.sub !== user._id.toString();

      if (err || !payload || !isTheUser) {
        resolve({
          resolved: false,
          error: isTheUser ? 'User not matching the token' : 'Refresh token expired',
        });
        return;
      }

      resolve({resolved: true});
    });
  });

  const {resolved, error} = await pr;

  if (!resolved) {
    return {
      error: error ?? 'Refresh token expired',
      status: 401,
    };
  }

  const token = await getToken(user);
  const refreshToken = await getRefreshToken(user);
  return {
    username: user.username,
    token,
    refreshToken,
  };
};
