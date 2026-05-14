import {v4} from 'uuid';
import {insertTicket} from '../infrastructure/tickets';
import type {ApiError} from '../../models/api-error';

// TODO: insert uuid + user uuid when implementation
export const genTicket = async (): Promise<{ticket: string} | ApiError> => {
  const uuid = v4();

  const id = await insertTicket(uuid);

  if (!id) {
    return {
      error: 'Could not insert ticket',
      status: 500,
    };
  }

  return {ticket: uuid};
};
