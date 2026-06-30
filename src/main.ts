import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';

import {initClient, closeClient} from './infrastructure/mongo';
import {initComAuth} from './routes/apps/features/init-apps-auth';
import mediaRouter from './routes/medias/router';
import chapterRouter from './routes/chapters/router';
import authRouter from './routes/auth/router';
import appsRouter from './routes/apps/router';
import bookmarkRouter from './routes/bookmarks/router';
import readingStatusRouter from './routes/readingStatus/router';
import wsRouter from './ws/router';
import {initMinio} from './infrastructure/minio';
import {memoryStore, keycloakConfig} from './routes/auth/utils/keycloak-config';
import {seedData} from './infrastructure/seed-data';

const env = process.env.NODE_ENV ?? 'dev';
const origin = process.env.ORIGIN ?? '*';

const port = process.env.PORT ?? '3001';
const ws = process.env.WS_PORT ?? '3002';
const corsOpts = {
  origin,
  optionsSuccessStatus: 200,
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(compression());
app.use(
  session({
    secret: process.env.KEYCLOAK_STORE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  }),
);
app.use(keycloakConfig.middleware());
app.set('trust proxy', env === 'production');
app.use(
  helmet({crossOriginResourcePolicy: {policy: env === 'production' ? 'same-origin' : 'same-site'}}),
);
app.use(cors(corsOpts));
app.disable('x-powered-by');

app.use('/auth', authRouter);
app.use('/media', mediaRouter);
app.use('/chapter', chapterRouter);
app.use('/apps', appsRouter);
app.use('/wss', wsRouter);
app.use('/bookmark', bookmarkRouter);
app.use('/readingStatus', readingStatusRouter);

const server = app.listen(port, async () => {
  try {
    await initClient();
    console.log('client initialized');
    await Promise.all([initComAuth(), initMinio(), seedData()]);
    console.log('minio initialized');

    console.log('websocket running on port ' + ws);
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
