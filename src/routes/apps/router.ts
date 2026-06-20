import {Router} from 'express';
import {appAuthSchema} from './types/schemas/app-auth-schema';
import {replaceAppToken} from './features/set-app-auth';
import {keycloakConfig} from '../auth/utils/keycloak-config';
import {validateData} from '@/core/middlewares/validation';

const router = Router();

router.use(keycloakConfig.protect('admin'));

router.put('/token', validateData(appAuthSchema, 'body'), async (req, res) => {
  const schema = appAuthSchema.parse(req.body);

  try {
    await replaceAppToken(schema);
  } catch (e) {
    console.log(e);
    res.status(500).json({error: e});
  }

  res.status(204).send();
});

export default router;
