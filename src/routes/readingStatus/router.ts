import {Router} from 'express';
import {keycloakConfig} from '../auth/utils/keycloak-config';
import type {ReadingStatus} from './types/domain/reading-status';
import {readReadingStatuses} from './features/read-reading-statuses';
import {createReadingStatus} from './features/create-reading-status';
import {validateData} from '@/core/middlewares/validation';
import {readingStatusSchema} from './types/schema/reading-status-schema';
import {uuidSchema} from '@/core/types/schemas/uuid-schema';
import {removeReadingStatus} from './features/remove-reading-status';

const router = Router();

router.use(keycloakConfig.protect());

router.get('/', async (_, res) => {
  let status = 200;
  let data: ReadingStatus[] | null = null;
  let error: string | null = null;

  try {
    data = await readReadingStatuses();
  } catch (e) {
    console.log(e);
    status = 500;
    error = 'Could not fetch reading statuses';
  }

  res.status(status).json({
    data,
    error,
  });
});

router.post('/', validateData(readingStatusSchema, 'body'), async (req, res) => {
  let status = 200;
  let data: ReadingStatus | null = null;
  let error: string | null = null;

  const dto = readingStatusSchema.parse(req.body);

  try {
    const res = await createReadingStatus(dto);
    if ('error' in res) {
      error = res.error;
      status = res.status;
    } else data = res;
  } catch (e) {
    console.log(e);
    status = 500;
    error = 'Could not fetch reading statuses';
  }

  res.status(status).json({
    data,
    error,
  });
});

router.delete('/:id', validateData(uuidSchema, 'params'), async (req, res) => {
  let status = 200;
  let data: string | null = null;
  let error: string | null = null;

  const {id} = uuidSchema.parse(req.params);

  try {
    const res = await removeReadingStatus(id);
    if ('error' in res) {
      error = res.error;
      status = res.status;
    } else data = res.id;
  } catch (e) {
    console.log(e);
    status = 500;
    error = 'Could not fetch reading statuses';
  }

  res.status(status).json({
    data,
    error,
  });
});

export default router;
