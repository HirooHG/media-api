import type {Document, WithId} from 'mongodb';

// TODO: user
export interface User extends WithId<Document> {
  username: string;
}
