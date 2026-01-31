import type {Document, WithId} from 'mongodb';

export type AuthType = 'com' | 'man';

export interface AppAuth extends WithId<Document> {
  type: AuthType;
  token: string;
  domain: string | null;
  identity: string | null;
}

export interface AppAuthDto extends Document {
  type: AuthType;
  token: string;
  domain: string | null;
  identity: string | null;
}
