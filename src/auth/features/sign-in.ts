import type {ApiError} from '../../models/api-error';
import {getUsers} from '../infrastructure';
import type {AuthResult} from '../models/result/auth-result';
import type {UserDto} from '../models/schemas/user-schema';
import {verifyPassword} from '../utils/crypto';
import {getRefreshToken, getToken} from '../utils/token';

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
