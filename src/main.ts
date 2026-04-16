import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import {initClient, closeClient} from './infrastructure/mongo';
import {initComAuth} from './medias/features/app-auth';
import mediasRouter from './medias/router';
import authRouter from './auth/router';
import {initAuth} from './auth/features/init-auth';
import {initMinio} from './infrastructure/minio';

const env = process.env.NODE_ENV ?? 'dev';
const origin = process.env.ORIGIN ?? '*';

const port = process.env.PORT ?? '3001';
const corsOpts = {
  origin,
  optionsSuccessStatus: 200,
};

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use(
  helmet({crossOriginResourcePolicy: {policy: env === 'production' ? 'same-origin' : 'same-site'}}),
);
app.use(cors(corsOpts));
app.use(express.static('public'));
app.disable('x-powered-by');

app.use('/auth', authRouter);
app.use('/media', mediasRouter);

const server = app.listen(port, async () => {
  try {
    await initClient();

    await Promise.all([initAuth(), initComAuth(), initMinio()]);

    console.log('client initialized');
    console.log('server running on port ' + port);
  } catch (err) {
    console.error('client failed to init: ' + err);
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  server.close(async () => {
    console.log('closing mongo client');
    await closeClient();
  });
});
