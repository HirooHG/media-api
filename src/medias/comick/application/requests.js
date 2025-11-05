const {DOMAIN_EXT, DOMAIN, API_URI} = require('./constants');

const ifetch = async (uri) => {
  return await fetch(uri, {
    method: 'GET',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept':
        'image/webp,image/avif,image/jxl,image/heic,image/heic-sequence,video/*;q=0.8,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
      'Referer': DOMAIN,
    },
  });
};

const cfetch = async (token, uri) => {
  return await fetch(uri, {
    method: 'GET',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'application/json',
      'Referer': DOMAIN,
      'Authorization': 'Bearer ' + token,
    },
  });
};

module.exports = {
  cfetch,
  ifetch,
};
