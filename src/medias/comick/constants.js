const DOMAIN_EXT = process.env.DOMAIN ?? 'art';
const DOMAIN = 'https://comick.' + DOMAIN_EXT;
const API_URI = DOMAIN + '/api';

const TOKEN = process.env.TOKEN ?? null;
const IDENTITY = process.env.IDENTITY ?? null;

module.exports = {
  DOMAIN_EXT,
  DOMAIN,
  API_URI,
  TOKEN,
  IDENTITY,
};
