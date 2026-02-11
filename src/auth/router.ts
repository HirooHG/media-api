import express from 'express';
import {validateData} from './middlewares/validation';
import {userLoginDtoSchema} from './models/schemas/user-schema';
import {refreshToken, signIn} from './features';
import type {AuthResult} from './models/result/auth-result';
import {refreshTokenSchema} from './models/schemas/refreshToken-schema';

const router = express.Router();

router.post('/refresh', validateData(refreshTokenSchema, 'body'), async (req, res) => {
  let status = 200;
  let data: AuthResult | null = null;
  let error: string | null = null;

  const refreshDto = refreshTokenSchema.parse(req.body);

  try {
    const token = await refreshToken(refreshDto);
    if ('error' in token) {
      error = token.error;
      status = token.status;
    } else data = token;
  } catch (e) {
    console.error(e);
    status = 500;
    error = "Couldn't authenticate";
  }

  res.status(status).send({
    data,
    error,
  });
});

router.post('/', validateData(userLoginDtoSchema, 'body'), async (req, res) => {
  let status = 200;
  let data: AuthResult | null = null;
  let error: string | null = null;

  const userDto = userLoginDtoSchema.parse(req.body);

  try {
    const token = await signIn(userDto);
    if ('error' in token) {
      error = token.error;
      status = token.status;
    } else data = token;
  } catch (e) {
    console.error(e);
    status = 500;
    error = "Couldn't authenticate";
  }

  res.status(status).send({
    data,
    error,
  });
});

export default router;
