import type {ItemBucketMetadata} from 'minio';
import {Client} from 'minio';

const bucket = process.env.MINIO_BUCKET;

const minio = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: true,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

export const initMinio = async () => {
  if (!bucket || bucket === '') {
    console.error('Minio bucket not defined');
    process.exit(1);
  }

  const hasBucket = await minio.bucketExists(bucket);

  if (!hasBucket) {
    await minio.makeBucket(bucket);
    console.log('Bucket created');
  }
};

export const saveImage = async (
  category: 'media' | 'chapter',
  name: string,
  image: Blob,
  data?: ItemBucketMetadata,
) => {
  const buffer = Buffer.from(await image.arrayBuffer());
  const uri = category + '/' + name;

  const {etag} = await minio.putObject(bucket, uri, buffer, buffer.length, data);

  return {
    uri,
    etag,
  };
};
