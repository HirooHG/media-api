import express from 'express';

import type {Media} from './models/domain/media';
import type {MediaImage} from './models/domain/media-image';
import {validateData} from '@/core/middlewares/validation';
import {paginationWithStatusSchema} from '@/core/types/schemas/pagination-schema';
import {keycloakConfig} from '../auth/utils/keycloak-config';
import type {GetAllMediasResult} from './models/result/get-all-medias-result';
import {filterSchema} from './models/schemas/filter-schema';
import {refreshComickFollows} from './features/refresh-comick-follows';
import {searchMedias} from './features/search-medias';
import {readingStatusIdSchema} from './models/schemas/reading-status-id-schema';
import {mediaIdSchema} from '../bookmarks/types/schemas/media-id-schema';
import {modifyReadingStatus} from './features/modify-reading-status';
import {getMediaReadingStatus} from './features/get-media-reading-status';
import type {ReadingStatus} from '../readingStatus/types/domain/reading-status';
import {readAllMedias} from './features/read-all-medias';
import {readMedia} from './features/read-media';
import {readMediaImage} from './features/read-media-image';
import {idSchema} from '@/core/types/schemas/id-schema';
import {readMediaLastChapter} from './features/read-media-last-chapter';

const router = express.Router();

router.use(keycloakConfig.protect());

router.get('/', validateData(paginationWithStatusSchema, 'query'), async (req, res) => {
  let data: GetAllMediasResult | null = null;
  let error: string | null = null;
  let reqStatus = 200;

  const {page, per_page, status} = paginationWithStatusSchema.parse(req.query);

  try {
    data = await readAllMedias(page, per_page, status);
  } catch (e) {
    console.log(e);
    reqStatus = 500;
    error = "Couldn't load comics";
  }

  res.status(reqStatus).json({
    data,
    error,
  });
});

router.get('/:id', validateData(idSchema, 'params'), async (req, res) => {
  let status = 200;
  let data: Media | null = null;
  let error: string | null = null;

  const {id} = idSchema.parse(req.params);

  try {
    const comic = await readMedia(id);
    if ('error' in comic) {
      status = comic.status;
      error = comic.error;
    } else data = comic;
  } catch (e) {
    console.log(e);
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
  let data: GetAllMediasResult | null = null;
  let error: string | null = null;

  const {page, per_page, status} = paginationWithStatusSchema.parse(req.query);

  try {
    const comics = await refreshComickFollows(page, per_page, status);
    if ('error' in comics) {
      reqStatus = comics.status;
      error = comics.error;
    } else data = comics;
  } catch (e) {
    console.log(e);
    reqStatus = 500;
    error = "Couldn't refresh comics";
  }

  res.status(reqStatus).send({
    data,
    error,
  });
});

router.get('/image/:id', validateData(idSchema, 'params'), async (req, res) => {
  let status = 200;
  let data: MediaImage | null = null;
  let error: string | null = null;

  const {id} = idSchema.parse(req.params);

  try {
    const res = await readMediaImage(id);
    if ('error' in res) {
      error = res.error;
      status = res.status;
    } else data = res;
  } catch (e) {
    console.log(e);
    status = 500;
    error = "Couldn't load comic image " + id;
  }

  res.status(status).send({
    data,
    error,
  });
});

router.post('/search', validateData(filterSchema, 'body'), async (req, res) => {
  let status = 200;
  let data: Media[] | null = null;
  let error: string | null = null;

  const {filter} = filterSchema.parse(req.body);

  try {
    data = await searchMedias(filter);
  } catch (e) {
    console.log(e);
    status = 500;
    error = "Couldn't search medias";
  }

  res.status(status).send({
    data,
    error,
  });
});

router.get('/:mediaId/readingStatus', validateData(mediaIdSchema, 'params'), async (req, res) => {
  let status = 200;
  let data: ReadingStatus | null = null;
  let error: string | null = null;

  const {mediaId} = mediaIdSchema.parse(req.params);

  try {
    const res = await getMediaReadingStatus(mediaId);
    if (res && 'error' in res) {
      status = res.status;
      error = res.error;
    } else data = res;
  } catch (e) {
    console.log(e);
    status = 500;
    error = "Couldn't modify reading status of media";
  }

  res.status(status).send({
    data,
    error,
  });
});

router.patch(
  '/:mediaId/readingStatus',
  validateData(mediaIdSchema, 'params'),
  validateData(readingStatusIdSchema, 'body'),
  async (req, res) => {
    let status = 200;
    let data: Media | null = null;
    let error: string | null = null;

    const {mediaId} = mediaIdSchema.parse(req.params);
    const {readingStatusId} = readingStatusIdSchema.parse(req.body);

    try {
      const res = await modifyReadingStatus(mediaId, readingStatusId);
      if ('error' in res) {
        status = res.status;
        error = res.error;
      } else data = res;
    } catch (e) {
      console.log(e);
      status = 500;
      error = "Couldn't modify reading status of media";
    }

    res.status(status).send({
      data,
      error,
    });
  },
);

router.get('/:id/lastChapter', validateData(idSchema, 'params'), async (req, res) => {
  let status = 200;
  let data: string | null = null;
  let error: string | null = null;

  const {id} = idSchema.parse(req.params);

  try {
    const comic = await readMediaLastChapter(id);
    if ('error' in comic) {
      status = comic.status;
      error = comic.error;
    } else data = comic.last_chapter;
  } catch (e) {
    console.log(e);
    status = 500;
    error = "Couldn't load comic " + id;
  }

  res.status(status).send({
    data,
    error,
  });
});

export default router;
