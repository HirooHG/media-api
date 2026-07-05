import type {Document, Filter} from 'mongodb';
import type {Media} from '../models/domain/media';
import type {PaginationDto} from '@/core/types/schemas/pagination-schema';
import {medias} from '../../../infrastructure/mongo';

export const getCountMedias = async (): Promise<number> => {
  return await medias.countDocuments();
};

export const getMedias = async (doc?: Document): Promise<Media[]> => {
  return (await medias.find(doc ?? {}).toArray()) as Media[];
};

export const getMediasPaginated = async ({
  page: p,
  per_page: pp,
  doc,
  proj,
}: {
  doc?: Filter<Document> | undefined;
  proj?: Document;
} & PaginationDto): Promise<Media[]> => {
  let ms = medias
    .find(doc ?? {})
    .sort('title', 1)
    .project({_id: 0, ...proj})
    .skip(pp * (p - 1))
    .limit(pp);

  return (await ms.toArray()) as Media[];
};

export const getMedia = async (doc: Filter<Document>): Promise<Media | null> => {
  return await medias.findOne<Media>(doc, {projection: {_id: 0}});
};

export const getMediaById = async (id: number): Promise<Media | null> => {
  return await medias.findOne<Media>({id}, {projection: {_id: 0}});
};

export const insertManyMedias = async (m: Media[]) => {
  return (await medias.insertMany(m)).insertedCount;
};

export const setMediaProp = async <T>(
  id: number,
  prop: keyof T,
  data: string | number | object | null,
) => {
  const obj: Document = {
    [prop]: data,
  };
  return await medias.updateOne({id}, {$set: obj});
};

export const setMedia = async (id: number, obj: Media): Promise<Media | null> => {
  return (await medias.findOneAndReplace({id}, obj, {
    projection: {_id: 0},
  })) as Media | null;
};
