import type {Document, Filter} from 'mongodb';
import {getMediasPaginated} from '../../infrastructure/medias';

export const getAllComics = async (page: number, per_page: number, status: number | null) => {
  const doc: Filter<Document> | undefined =
    status !== undefined && status !== null ? {comic_status: status} : undefined;

  return await getMediasPaginated(doc, {_id: 0, id: 0}, per_page, page);
};
