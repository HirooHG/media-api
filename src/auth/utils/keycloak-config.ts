import KeycloakConnect, {type KeycloakConfig} from 'keycloak-connect';

const config: KeycloakConfig = {
  'auth-server-url': process.env.KEYCLOAK_URL,
  resource: process.env.KEYCLOAK_CLIENT_ID,
  realm: process.env.KEYCLOAK_REALM,
  'confidential-port': 443,
  'ssl-required': 'external',
  'bearer-only': true,
};

export const keycloakConfig = new KeycloakConnect({}, config);
