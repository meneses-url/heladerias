const logger = require('../lib/logger');

function notFoundHandler(req, res, next) {
  res.status(404).json({
    message: `Ruta ${req.originalUrl} no encontrada`
  });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  logger.error({ err, path: req.originalUrl, statusCode }, err.message);
  res.status(statusCode).json({
    message: err.message || 'Error interno del servidor'
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
