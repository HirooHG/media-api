const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const {initClient, closeClient} = require('./medias/comick/model/db');

const env = process.env.NODE_ENV ?? 'dev';

const port = 3000;
const corsOpts = {
  origin: 'https://api.hugo-golliet.dev',
  optionsSuccessStatus: 200,
};
const mediasRouter = require('./medias/router');

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
    console.log('client initialized');
    console.log('server running on port ' + port);
  } catch (err) {
    console.error('client failed to init');
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  server.close(async () => {
    console.log('closing mongo client');
    await closeClient();
  });
});
