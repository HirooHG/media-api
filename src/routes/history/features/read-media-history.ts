import {getMediaHistoric} from '../infrastructure/history';

export const readMediaHistory = async (limit: number) => {
  return await getMediaHistoric(limit);
};
