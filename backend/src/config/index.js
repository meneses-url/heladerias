const dotenv = require('dotenv');

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || '0.0.0.0'
  },
  security: {
    jwt: {
      accessSecret: process.env.JWT_SECRET || 'dev-secret',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
      accessExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    }
  },
  rateLimit: {
    windowMs:
      parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

module.exports = config;
