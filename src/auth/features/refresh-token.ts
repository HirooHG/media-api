import type {ApiError} from '../../models/api-error';
import {getUserByName} from '../infrastructure';
import type {AuthResult} from '../models/result/auth-result';
import type {RefreshTokenDto} from '../models/schemas/refreshToken-schema';
import jwt, {type JwtPayload} from 'jsonwebtoken';
import {getRefreshToken, getToken, sec} from '../utils/token';

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
      const isTheUser = payload?.sub === user._id.toString();

      if (err !== null || !payload || !isTheUser) {
        resolve({
          resolved: false,
          error: !isTheUser ? 'User not matching the token' : 'Refresh token expired',
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
      status: 403,
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
