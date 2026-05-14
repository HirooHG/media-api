// env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      WS_PORT: number;
      ORIGIN: string;
      // db
      DB_HOST: string;
      // minio
      MINIO_BUCKET: string;
      MINIO_ENDPOINT: string;
      MINIO_PORT: number;
      MINIO_USESSL: string;
      MINIO_ROOT_USER: string;
      MINIO_ROOT_PASSWORD: string;
      // auth
      KEYCLOAK_URL: string;
      KEYCLOAK_REALM: string;
      KEYCLOAK_CLIENT_ID: string;
      KEYCLOAK_STORE_SECRET: string;
    }
  }
}

export {};
