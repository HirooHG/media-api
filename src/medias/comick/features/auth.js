const {COM_TOKEN, COM_IDENTITY, COM_DOMAIN} = require('../constants');
const {setAuth, getAuth} = require('../model/db');

const initAuth = async () => {
  const domain = COM_DOMAIN;
  const token = COM_TOKEN;
  const identity = COM_IDENTITY;

  if (!domain || !token || !identity) {
    throw new Error('Token, domain or identity not provided');
  }

  const creds = await getAuth({domain});
  if (creds?.token !== token || creds?.identity !== identity || creds?.domain !== domain) {
    await setAuth(domain, token, identity);
    console.log('replaced current token|domain|identity');
  }
};

module.exports = {
  initAuth,
};
