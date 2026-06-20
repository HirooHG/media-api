import {Router} from 'express';
import {keycloakConfig} from '../auth/utils/keycloak-config';
import type {Bookmark} from './types/domain/bookmark';
import {getAllBookmarks} from './infrastructure/bookmark';
import {validateData} from '@/core/middlewares/validation';
import {bookmarkIdSchema} from './types/schemas/bookmark-id-schema';
import {modifyBookmarkChapter} from './features/modify-bookmark-chapter';
import {mediaIdSchema} from './types/schemas/media-id-schema';
import {createBookmark} from './features/create-bookmark';
import {getBookmarkByMedia} from './features/get-bookmark-by-media';
import {removeBookmark} from './features/remove-bookmark';
import {
  createOrUpdateBookmarkSchema,
  createOrUpdateBookmarkSchemaChapterHid,
} from './types/schemas/create-or-update-bookmark-schema';
import {upsertBookmarkChapHid} from './features/upsert-bookmark-chap-hid';

const router = Router();

router.use(keycloakConfig.protect());

router.get('/', async (_, res) => {
  let status = 200;
  let error: string | null = null;
  let data: Bookmark[] | null = null;

  try {
    data = await getAllBookmarks();
  } catch (e) {
    status = 500;
    console.log(e);
    error = 'Could not load bookmarks';
  }

  res.status(status).json({
    data,
    error,
  });
});

router.get('/media/:mediaId', validateData(mediaIdSchema, 'params'), async (req, res) => {
  let status = 200;
  let error: string | null = null;
  let data: Bookmark | null = null;

  const {mediaId} = mediaIdSchema.parse(req.params);

  try {
    data = await getBookmarkByMedia(mediaId);
  } catch (e) {
    status = 500;
    console.log(e);
    error = 'Could not get bookmark';
  }

  res.status(status).json({
    data,
    error,
  });
});

router.post('/', validateData(createOrUpdateBookmarkSchema, 'body'), async (req, res) => {
  let status = 200;
  let error: string | null = null;
  let data: Bookmark | null = null;

  const {mediaId, chapterId} = createOrUpdateBookmarkSchema.parse(req.body);

  try {
    const res = await createBookmark(mediaId, chapterId);
    if ('error' in res) {
      error = res.error;
      status = res.status;
    } else data = res;
  } catch (e) {
    status = 500;
    console.log(e);
    error = 'Could not create bookmark';
  }

  res.status(status).json({
    data,
    error,
  });
});

router.post(
  '/hid',
  validateData(createOrUpdateBookmarkSchemaChapterHid, 'body'),
  async (req, res) => {
    let status = 200;
    let error: string | null = null;
    let data: Bookmark | null = null;

    const {mediaId, chapterHid} = createOrUpdateBookmarkSchemaChapterHid.parse(req.body);

    try {
      const res = await upsertBookmarkChapHid(mediaId, chapterHid);
      if ('error' in res) {
        error = res.error;
        status = res.status;
      } else data = res;
    } catch (e) {
      status = 500;
      console.log(e);
      error = 'Could not create bookmark';
    }

    res.status(status).json({
      data,
      error,
    });
  },
);

router.put(
  '/:id',
  validateData(bookmarkIdSchema, 'params'),
  validateData(createOrUpdateBookmarkSchema, 'body'),
  async (req, res) => {
    let status = 200;
    let error: string | null = null;
    let data: Bookmark | null = null;

    const {id} = bookmarkIdSchema.parse(req.params);
    const {mediaId, chapterId} = createOrUpdateBookmarkSchema.parse(req.body);

    try {
      const res = await modifyBookmarkChapter(id, mediaId, chapterId);
      if ('error' in res) {
        error = res.error;
        status = res.status;
      } else data = res;
    } catch (e) {
      status = 500;
      console.log(e);
      error = 'Could not modify bookmark';
    }

    res.status(status).json({
      data,
      error,
    });
  },
);

router.delete('/:id', validateData(bookmarkIdSchema, 'params'), async (req, res) => {
  let status = 200;
  let error: string | null = null;
  let data: string | null = null;

  const {id} = bookmarkIdSchema.parse(req.params);

  try {
    const res = await removeBookmark(id);
    if ('error' in res) {
      error = res.error;
      status = res.status;
    } else data = res.id;
  } catch (e) {
    status = 500;
    console.log(e);
    error = 'Could not delete bookmark';
  }

  res.status(status).json({
    data,
    error,
  });
});

export default router;
