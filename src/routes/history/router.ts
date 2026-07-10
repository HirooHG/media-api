import {validateData} from '@/core/middlewares/validation';
import {Router} from 'express';
import {mediaIdSchema} from '../bookmarks/types/schemas/media-id-schema';
import {pileMediaHistory} from './features/pile-media-history';
import {readMediaHistory} from './features/read-media-history';
import {removeMediaHistory} from './features/remove-media-history';
import type {MediaHistory} from './types/domain/media-history';
import {limitSchema} from './types/schema/limit-schema';
import {chapterHidSchema} from '../bookmarks/types/schemas/chapter-id-schema';

const router = Router();

router.get('/', validateData(limitSchema, 'query'), async (req, res) => {
  let status = 200;
  let data: MediaHistory[] | null = null;
  let error: string | null = null;

  let {limit} = limitSchema.parse(req.query);

  try {
    data = await readMediaHistory(limit);
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

router.put(
  '/:mediaId',
  validateData(mediaIdSchema, 'params'),
  validateData(chapterHidSchema, 'body'),
  async (req, res) => {
    let status = 200;
    let data: MediaHistory | null = null;
    let error: string | null = null;

    const {mediaId} = mediaIdSchema.parse(req.params);
    const {chapterHid} = chapterHidSchema.parse(req.body);

    try {
      const res = await pileMediaHistory(mediaId, chapterHid);
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

router.delete('/:mediaId', validateData(mediaIdSchema, 'params'), async (req, res) => {
  let status = 200;
  let data: number | null = null;
  let error: string | null = null;

  const {mediaId} = mediaIdSchema.parse(req.params);

  try {
    const res = await removeMediaHistory(mediaId);
    if ('error' in res) {
      status = res.status;
      error = res.error;
    } else data = res.id;
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

export default router;
