import type {ApiError} from '../../models/api-error';
import {findTicket} from '../infrastructure/tickets';
import type {Ticket} from '../types/ticket';

// TODO: insert uuid + user uuid when implementation
export const getTicketById = async (id: string): Promise<Ticket | ApiError> => {
  const ticket = await findTicket(id);

  if (!ticket) {
    return {
      error: 'ticket not found',
      status: 404,
    };
  }

  return ticket;
};
