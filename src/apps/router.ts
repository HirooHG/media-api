import {Router} from 'express';
import {validateData} from '../auth/middlewares/validation';
import {appAuthSchema} from './types/schemas/app-auth-schema';
import {replaceAppToken} from './features/set-app-auth';
import {keycloakConfig} from '../auth/utils/keycloak-config';

const router = Router();

router.use(keycloakConfig.protect('admin'));

router.put('/token', validateData(appAuthSchema, 'body'), async (req, res) => {
  const schema = appAuthSchema.parse(req.body);

  try {
    await replaceAppToken(schema);
  } catch (e) {
    console.error(e);
    res.status(500).json({error: e});
  }

  res.status(204).send();
});

export default router;
