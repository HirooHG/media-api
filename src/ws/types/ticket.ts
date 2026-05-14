import type {Document, WithId} from 'mongodb';

export interface Ticket extends WithId<Document> {
  ticket: string; // Uuid v4
}
