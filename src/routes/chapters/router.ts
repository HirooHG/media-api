import {Router} from 'express';
import {keycloakConfig} from '../auth/utils/keycloak-config';
import {validateData} from '@/core/middlewares/validation';
import type {Chapter} from './types/domain/chapter';
import {getChapters} from './features/get-chapters';
import {refreshChapters} from './features/refresh-chapters';
import {getChapterDetails} from './features/get-chapter-details';
import {idSchema} from '@/core/types/schemas/id-schema';
import {mediaIdAndChapterIdValidationSchema} from '../medias/models/schemas/media-id-validation-schema';
import {chapterHidSchema} from '../bookmarks/types/schemas/chapter-id-schema';
import {patchChapterSchema} from './types/schemas/patch-chapter-schema';
import {modifyChapter} from './features/modify-chapter';

const router = Router();

router.use(keycloakConfig.protect());

router.get('/media/:id', validateData(idSchema, 'params'), async (req, res) => {
  let status = 200;
  let data: Chapter[] | null = null;
  let error: string | null = null;

  const {id} = idSchema.parse(req.params);

  try {
    const chapters = await getChapters(id);
    if ('error' in chapters) {
      status = chapters.status;
      error = chapters.error;
    } else data = chapters;
  } catch (e) {
    console.log(e);
    status = 500;
    error = "Couldn't load chapters";
  }

  res.status(status).send({
    data,
    error,
  });
});

router.post('/refresh/media/:id', validateData(idSchema, 'params'), async (req, res) => {
  let status = 200;
  let data: Chapter[] | null = null;
  let error: string | null = null;

  const {id} = idSchema.parse(req.params);

  try {
    const chapters = await refreshChapters(id);
    if ('error' in chapters) {
      status = chapters.status;
      error = chapters.error;
    } else data = chapters;
  } catch (e) {
    console.log(e);
    status = 500;
    error = "Couldn't load chapters";
  }

  res.status(status).send({
    data,
    error,
  });
});

router.get(
  '/media/:id/:chapterHid',
  validateData(mediaIdAndChapterIdValidationSchema, 'params'),
  async (req, res) => {
    let status = 200;
    let data: Chapter | null = null;
    let error: string | null = null;

    const {id, chapterHid} = mediaIdAndChapterIdValidationSchema.parse(req.params);

    try {
      const chapter = await getChapterDetails(id, chapterHid);
      if ('error' in chapter) {
        status = chapter.status;
        error = chapter.error;
      } else data = chapter;
    } catch (e) {
      console.log(e);
      status = 500;
      error = "Couldn't load chapter";
    }

    res.status(status).send({
      data,
      error,
    });
  },
);

router.patch(
  '/:chapterHid',
  validateData(chapterHidSchema, 'params'),
  validateData(patchChapterSchema, 'body'),
  async (req, res) => {
    let status = 200;
    let data: string | null = null;
    let error: string | null = null;

    const {chapterHid} = chapterHidSchema.parse(req.params);
    const dto = patchChapterSchema.parse(req.body);

    try {
      const res = await modifyChapter(chapterHid, dto);
      if ('error' in res) {
        status = res.status;
        error = res.error;
      } else data = res.hid;
    } catch (e) {
      console.log(e);
      status = 500;
      error = "Couldn't load chapters";
    }

    res.status(status).send({
      data,
      error,
    });
  },
);

export default router;
