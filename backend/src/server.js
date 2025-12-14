const app = require('./app');
const config = require('./config');
const logger = require('./lib/logger');

const { port, host } = config.app;

app.listen(port, host, () => {
  logger.info({ host, port }, `API lista en http://${host}:${port}`);
});
