const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

require('dotenv').config();

const {initClient, closeClient} = require('./medias/comick/model/db');
const {initAuth} = require('./medias/comick/features/auth');
const mediasRouter = require('./medias/router');

const env = process.env.NODE_ENV ?? 'dev';
const origin = process.env.ORIGIN ?? '*';

const port = process.env.PORT ?? '3001';
const corsOpts = {
  origin,
  optionsSuccessStatus: 200,
};

const app = express();

app.use(compression());
app.use(
  helmet({crossOriginResourcePolicy: {policy: env === 'production' ? 'same-origin' : 'same-site'}}),
);
app.use(cors(corsOpts));
app.use(express.static('public'));
app.disable('x-powered-by');

app.use('/media', mediasRouter);

const server = app.listen(port, async () => {
  try {
    await initClient();
    await initAuth();
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
