import {ifetch} from '../utils/requests';

const COMICK_ERROR = 'Error with fetch comick, renew the token maybe';

export const getComickImage = async (uri: string) => {
  const i = await ifetch(uri);

  if (!i.ok) throw Error(COMICK_ERROR);

  return await i.blob();
};
