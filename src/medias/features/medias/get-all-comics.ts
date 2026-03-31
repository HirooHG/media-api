import type {Document, Filter} from 'mongodb';
import {getMediasPaginated} from '../../infrastructure/medias';

export const getAllComics = async (page: number, per_page: number, status: number | null) => {
  const doc: Filter<Document> | undefined =
    status !== undefined && status !== null ? {comic_status: status} : undefined;

  return await getMediasPaginated({doc, per_page, page});
};
