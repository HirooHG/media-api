import {chapterHidSchema, chapterIdSchema} from './chapter-id-schema';
import {mediaIdSchema} from './media-id-schema';

export const createOrUpdateBookmarkSchema = chapterIdSchema.and(mediaIdSchema);
export const createOrUpdateBookmarkSchemaChapterHid = chapterHidSchema.and(mediaIdSchema);
