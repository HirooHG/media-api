const COM_DOMAIN = process.env.COM_DOMAIN ?? 'art';
const COM_URI = process.env.COM_URI + '.' + COM_DOMAIN;
const COM_API_URI = COM_URI + '/api';

const COM_TOKEN = process.env.COM_TOKEN ?? null;
const COM_IDENTITY = process.env.COM_IDENTITY ?? null;

module.exports = {
  COM_DOMAIN,
  COM_URI,
  COM_API_URI,
  COM_TOKEN,
  COM_IDENTITY,
};
