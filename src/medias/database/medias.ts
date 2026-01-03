import type {Document, Filter} from 'mongodb';
import type {Media} from '../models/domain/media';
import {db} from './mongo';
import type {MediaDto} from '../models/dto/media.dto';

const medias = db.collection('media');

export const getMedias = async (): Promise<Media[]> => {
  return (await medias.find().toArray()) as Media[];
};

export const getMediasPaginated = async (
  doc: Filter<Document> | undefined,
  proj: Document,
  per_page: number = 5,
  page: number = 1,
): Promise<Media[]> => {
  let ms = medias
    .find(doc ?? {})
    .project(proj)
    .skip((per_page ?? 5) * (page - 1));
  if (per_page) ms = ms.limit(per_page);

  return (await ms.toArray()) as Media[];
};

export const getMedia = async (doc: Filter<Document>): Promise<Media | null> => {
  return await medias.findOne<Media>(doc);
};

export const getMediaById = async (id: number): Promise<Media | null> => {
  return await medias.findOne<Media>({comic_id: id});
};

export const insertManyMedias = async (m: MediaDto[]) => {
  return (await medias.insertMany(m)).insertedCount;
};

export const setMediaProp = async (id: number, prop: string, data: string | number | object) => {
  const obj = {} as Document;
  obj[prop] = data;
  return await medias.updateOne({comic_id: id}, {$set: obj});
};

export const setMedia = async (id: number, obj: MediaDto): Promise<Media | null> => {
  return (await medias.findOneAndReplace({comic_id: id}, obj)) as Media | null;
};
