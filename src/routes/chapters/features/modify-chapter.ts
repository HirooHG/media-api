import type {ApiError} from '@/core/types/api-error';
import {getChapterByHid, setPartialChapter} from '../infrastructure/chapters';
import type {PatchChapterDto} from '../types/schemas/patch-chapter-schema';

export const modifyChapter = async (
  hid: string,
  dto: PatchChapterDto,
): Promise<{hid: string} | ApiError> => {
  const chap = await getChapterByHid(hid);
  if (!chap) return {error: 'Chapter not found', status: 404};

  const res = await setPartialChapter(chap.id, dto);
  if (res !== 1) return {error: 'Could not patch chapter', status: 500};

  return {hid};
};
