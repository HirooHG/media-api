import type {Document, Filter} from 'mongodb';
import {getMediasPaginated} from '../infrastructure/medias';
import type {Media} from '../models/domain/media';

export const searchMedias = async (filter: string): Promise<Media[]> => {
  const doc: Filter<Document> = {
    title: {$regex: new RegExp(filter), $options: 'i'},
  };
  const medias = await getMediasPaginated({doc, per_page: 5, page: 1});
  return medias;
};
