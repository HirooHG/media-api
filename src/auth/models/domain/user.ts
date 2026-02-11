import type {Document, WithId} from 'mongodb';
import type {Role} from './role';

export interface User extends WithId<Document> {
  username: string;
  hashedPwd: string;
  role: Role;
}

export interface UserToken {
  id: string;
  username: string;
  role: string;
}
