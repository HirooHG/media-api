import type {Document, Filter} from 'mongodb';
import type {Media} from '../models/domain/media';
import {medias} from '../../infrastructure/mongo';
import type {PaginationDto} from '../models/schemas/pagination-schema';

export const getMedias = async (): Promise<Media[]> => {
  return (await medias.find().toArray()) as Media[];
};

export const getMediasPaginated = async ({
  page,
  per_page,
  doc,
  proj,
}: {
  doc?: Filter<Document> | undefined;
  proj?: Document;
} & PaginationDto): Promise<Media[]> => {
  const pp = per_page ?? 5;
  const p = page ?? 1;

  let ms = medias
    .find(doc ?? {})
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

export const setMediaProp = async (id: number, prop: string, data: string | number | object) => {
  const obj: Document = {
    [prop]: data,
  };
  return await medias.updateOne({comic_id: id}, {$set: obj});
};

export const setMedia = async (id: number, obj: Media): Promise<Media | null> => {
  return (await medias.findOneAndReplace({comic_id: id}, obj, {
    projection: {_id: 0},
  })) as Media | null;
};
