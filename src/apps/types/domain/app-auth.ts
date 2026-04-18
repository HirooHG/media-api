import type {Document, WithId} from 'mongodb';
import type {AuthType} from '../schemas/app-auth';

export interface AppAuth extends WithId<Document> {
  type: AuthType;
  token: string;
  domain: string | undefined;
  identity: string | undefined;
}
