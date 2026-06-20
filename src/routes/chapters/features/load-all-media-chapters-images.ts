import {getComicChapterDetails} from './get-comic-chapter-details';
import {getComicChapters} from './get-comic-chapters';

export const loadAllMediaChaptersImages = async (mediaId: number) => {
  const chapters = await getComicChapters(mediaId);
  if ('error' in chapters) throw new Error(`Could not fetch chapters: ${chapters.error}`);

  for (let i = 0; i < chapters.length; i++) {
    const chap = chapters[i]!;
    const details = await Promise.all(
      chap.versions.map((v) => getComicChapterDetails(mediaId, v.hid)),
    );
    if ('error' in details)
      throw new Error(
        `Could not fetch images of media ${mediaId} and chapter: ${chap.id}, fetched ${i + 1} chapters`,
      );
  }

  return `${chapters.length} has been loaded`;
};
