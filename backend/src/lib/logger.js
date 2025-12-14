const pino = require('pino');
const config = require('../config');

const logger = pino({
  level: config.logging.level,
  base: { env: config.env, service: 'dulce-tentacion-api' }
});

module.exports = logger;
