const prisma = require('../lib/prisma');
const ApiError = require('../utils/apiError');
const { verifyAccessToken } = require('../utils/jwt');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, 'Token requerido'));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Usuario no disponible');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'No autenticado'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'No tienes permisos para esta acción'));
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorizeRoles
};
