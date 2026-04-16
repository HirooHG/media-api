// env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MINIO_BUCKET: string;
      MINIO_ENDPOINT: string;
      MINIO_PORT: number;
      MINIO_ROOT_USER: string;
      MINIO_ROOT_PASSWORD: string;
    }
  }
}

export {};
