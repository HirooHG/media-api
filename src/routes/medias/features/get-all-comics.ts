import type {Document, Filter} from 'mongodb';
import type {GetAllMediasResult} from '../models/result/get-all-medias-result';
import {getMediasPaginated, getCountMedias} from '../infrastructure/medias';

export const getAllComics = async (
  page: number,
  per_page: number,
  status: number | null,
): Promise<GetAllMediasResult> => {
  const doc: Filter<Document> | undefined =
    status !== undefined && status !== null ? {status: status} : undefined;

  const medias = await getMediasPaginated({doc, per_page, page});
  const count = await getCountMedias();
  const lastPage = Math.ceil(count / per_page);

  return {
    medias,
    pagination: {
      lastPage: lastPage === 0 ? 1 : lastPage,
    },
  };
};
