import {tickets} from '../../infrastructure/mongo';
import type {Ticket} from '../types/ticket';

// TODO: insert uuid + user uuid when implementation
export const insertTicket = async (ticket: string) => {
  return (await tickets.insertOne({ticket})).insertedId;
};

export const findTicket = async (ticket: string) => {
  return (await tickets.findOne({ticket})) as Ticket;
};

export const deleteTicket = async (ticket: string) => {
  return (await tickets.deleteOne({ticket})).deletedCount;
};
