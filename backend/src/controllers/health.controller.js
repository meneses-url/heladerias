const prisma = require('../lib/prisma');

async function getHealthStatus(req, res, next) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: 'connected'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getHealthStatus };
