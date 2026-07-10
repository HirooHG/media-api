import type {ApiError} from '@/core/types/api-error';
import {getMediaById} from '../infrastructure/medias';
import {getMediaChapters} from '@/routes/chapters/infrastructure/chapters';

export const readMediaLastChapter = async (
  id: number,
): Promise<{last_chapter: string | null} | ApiError> => {
  const media = await getMediaById(id);
  if (!media) return {error: 'Media not found', status: 404};

  const chapters = await getMediaChapters(id);
  if (chapters.length === 0) return {last_chapter: null};

  let chapter: number | null = null;
  for (const {chap} of chapters) {
    if (isNaN(Number(chap))) continue;
    const c = parseInt(chap);
    if (c > (chapter ?? 0)) chapter = c;
  }

  return {last_chapter: chapter?.toString() ?? null};
};
