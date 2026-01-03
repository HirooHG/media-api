import {COM_URI} from '../../constants';

export const ifetch = async (uri: string) => {
  return await fetch(uri, {
    method: 'GET',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept':
        'image/webp,image/avif,image/jxl,image/heic,image/heic-sequence,video/*;q=0.8,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
      'Referer': COM_URI,
    },
  });
};

export const cfetch = async (token: string, uri: string) => {
  return await fetch(uri, {
    method: 'GET',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'application/json',
      'Referer': COM_URI,
      'Authorization': 'Bearer ' + token,
    },
  });
};
