import express from 'express';

import type {Media} from './models/domain/media';
import type {MediaImage} from './models/domain/media-image';
import type {Chapter} from './models/domain/chapter';
import {auth} from '../auth/middlewares/auth-middleware';
import {getAllComics} from './features/medias/get-all-comics';
import {getComic} from './features/medias/get-comic';
import {refreshComickFollows} from './features/medias/refresh-comick-follows';
import {getComicChapters} from './features/chapters/get-comic-chapters';
import {refreshComicChapters} from './features/chapters/refresh-comic-chapters';
import {getComicChapterDetails} from './features/chapters/get-comic-chapter-details';
import {getComicImage} from './features/medias/get-comic-image';
import {validateData} from '../auth/middlewares/validation';
import {paginationWithStatusSchema} from './models/schemas/pagination-schema';
import {
  comicIdAndChapterIdValidationSchema,
  comicIdValidationSchema,
} from './models/schemas/comic-id-validation-schema';
import {keycloakConfig} from '../auth/utils/keycloak-config';

const router = express.Router();

router.use(keycloakConfig.protect());

router.get('/', validateData(paginationWithStatusSchema, 'query'), async (req, res) => {
  let data: Media[] | null = null;
  let error: string | null = null;
  let reqStatus = 200;

  const {page, per_page, status} = paginationWithStatusSchema.parse(req.query);

  try {
    data = await getAllComics(page, per_page, status);
  } catch (e) {
    console.error(e);
    reqStatus = 500;
    error = "Couldn't load comics";
  }

  res.status(reqStatus).json({
    data,
    error,
  });
});

router.get('/comic/:id', validateData(comicIdValidationSchema, 'params'), async (req, res) => {
  let status = 200;
  let data: Media | null = null;
  let error: string | null = null;

  const {id} = comicIdValidationSchema.parse(req.params);

  try {
    const comic = await getComic(id);
    if ('error' in comic) {
      status = comic.status;
      error = comic.error;
    } else data = comic;
  } catch (e) {
    console.error(e);
    status = 500;
    error = "Couldn't load comic " + id;
  }

  res.status(status).send({
    data,
    error,
  });
});

router.post('/refresh', validateData(paginationWithStatusSchema, 'query'), async (req, res) => {
  let reqStatus = 200;
  let data: Media[] | null = null;
  let error: string | null = null;

  const {page, per_page, status} = paginationWithStatusSchema.parse(req.query);

  try {
    const comics = await refreshComickFollows(page, per_page, status);
    if ('error' in comics) {
      reqStatus = comics.status;
      error = comics.error;
    } else data = comics;
  } catch (e) {
    console.error(e);
    reqStatus = 500;
    error = "Couldn't refresh comics";
  }

  res.status(reqStatus).send({
    data,
    error,
  });
});

router.get(
  '/comic/:id/chapters',
  validateData(comicIdValidationSchema, 'params'),
  async (req, res) => {
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
      console.error(e);
      status = 500;
      error = "Couldn't load chapters";
    }

    res.status(status).send({
      data,
      error,
    });
  },
);

router.post(
  '/refresh/comic/:id/chapters',
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
      console.error(e);
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
  '/comic/:id/chapter/:chapterId',
  validateData(comicIdAndChapterIdValidationSchema, 'params'),
  async (req, res) => {
    let status = 200;
    let data: Chapter | null = null;
    let error: string | null = null;

    const {id, chapterId} = comicIdAndChapterIdValidationSchema.parse(req.params);

    try {
      const chapter = await getComicChapterDetails(id, chapterId);
      if ('error' in chapter) {
        status = chapter.status;
        error = chapter.error;
      } else data = chapter;
    } catch (e) {
      console.error(e);
      status = 500;
      error = "Couldn't load chapter";
    }

    res.status(status).send({
      data,
      error,
    });
  },
);

router.get(
  '/comic/image/:id',
  validateData(comicIdValidationSchema, 'params'),
  async (req, res) => {
    let status = 200;
    let data: MediaImage | null = null;
    let error: string | null = null;

    const {id} = comicIdValidationSchema.parse(req.params);

    try {
      const res = await getComicImage(id);
      if ('error' in res) {
        error = res.error;
        status = res.status;
      } else data = res;
    } catch (e) {
      console.error(e);
      status = 500;
      error = "Couldn't load comic image " + id;
    }

    res.status(status).send({
      data,
      error,
    });
  },
);

export default router;
