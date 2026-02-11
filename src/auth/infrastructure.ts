import {api_auth} from '../infrastructure/mongo';
import type {User} from './models/domain/user';

export const setUser = async (user: User) => {
  return await api_auth.insertOne(user);
};

export const getUserByName = async (username: string) => {
  return await api_auth.findOne<User>({username});
};

export const getUsers = async () => {
  return (await api_auth.find().toArray()) as User[];
};
