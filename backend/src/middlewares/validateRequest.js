const ApiError = require('../utils/apiError');

function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });

      req.body = parsed.body || req.body;
      req.params = parsed.params || req.params;
      req.query = parsed.query || req.query;

      next();
    } catch (error) {
      const message = error.errors?.[0]?.message || 'Datos inválidos';
      next(new ApiError(400, message));
    }
  };
}

module.exports = validateRequest;
