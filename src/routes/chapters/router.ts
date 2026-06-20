import {Router} from 'express';
import {keycloakConfig} from '../auth/utils/keycloak-config';
import {validateData} from '@/core/middlewares/validation';
import {
  comicIdValidationSchema,
  comicIdAndChapterIdValidationSchema,
} from '../medias/models/schemas/comic-id-validation-schema';
import {getComicChapterDetails} from './features/get-comic-chapter-details';
import {getComicChapters} from './features/get-comic-chapters';
import {refreshComicChapters} from './features/refresh-comic-chapters';
import type {Chapter} from './types/domain/chapter';

const router = Router();

router.use(keycloakConfig.protect());

router.get('/media/:id', validateData(comicIdValidationSchema, 'params'), async (req, res) => {
  let status = 200;
  let data: Chapter[] | null = null;
  let error: string | null = null;

  const {id} = comicIdValidationSchema.parse(req.params);

  try {
    const chapters = await getComicChapters(id);
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

router.post(
  '/refresh/media/:id',
  validateData(comicIdValidationSchema, 'params'),
  async (req, res) => {
    let status = 200;
    let data: Chapter[] | null = null;
    let error: string | null = null;

    const {id} = comicIdValidationSchema.parse(req.params);

    try {
      const chapters = await refreshComicChapters(id);
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
  },
);

router.get(
  '/media/:id/:chapterHid',
  validateData(comicIdAndChapterIdValidationSchema, 'params'),
  async (req, res) => {
    let status = 200;
    let data: Chapter | null = null;
    let error: string | null = null;

    const {id, chapterHid} = comicIdAndChapterIdValidationSchema.parse(req.params);

    try {
      const chapter = await getComicChapterDetails(id, chapterHid);
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

export default router;
