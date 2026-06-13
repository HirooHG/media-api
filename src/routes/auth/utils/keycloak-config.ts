import KeycloakConnect, {type KeycloakConfig} from 'keycloak-connect';
import session from 'express-session';

const config: KeycloakConfig = {
  'auth-server-url': process.env.KEYCLOAK_URL,
  resource: process.env.KEYCLOAK_CLIENT_ID,
  realm: process.env.KEYCLOAK_REALM,
  'confidential-port': 443,
  'ssl-required': 'external',
  'bearer-only': true,
};

export const memoryStore = new session.MemoryStore();
export const keycloakConfig = new KeycloakConnect({store: memoryStore}, config);
