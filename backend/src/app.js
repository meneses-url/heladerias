const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const config = require('./config');
const logger = require('./lib/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandlers');

const app = express();

const httpLogger = pinoHttp({
  logger,
  customLogLevel: (res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  }
});

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(httpLogger);
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
