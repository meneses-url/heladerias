const ApiError = require('../utils/apiError');
const { comparePassword } = require('../utils/password');
const logger = require('../lib/logger');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require('../utils/jwt');
const {
  findUserByEmail,
  sanitizeUser,
  getUserById
} = require('./user.service');

function buildTokens(user) {
  const payload = { sub: user.id, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload)
  };
}

async function login({ email, password }) {
  const user = await findUserByEmail(email, { includePassword: true });

  if (!user || !user.isActive) {
    logger.warn({ email }, 'Intento de login con usuario inválido');
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    logger.warn({ userId: user.id }, 'Intento de login con contraseña inválida');
    throw new ApiError(401, 'Credenciales inválidas');
  }

  logger.info({ userId: user.id }, 'Usuario autenticado');

  return {
    user: sanitizeUser(user),
    tokens: buildTokens(user)
  };
}

async function refreshSession(refreshToken) {
  const payload = verifyRefreshToken(refreshToken);
  const user = await getUserById(payload.sub);

  if (!user || !user.isActive) {
    logger.warn({ userId: payload.sub }, 'Refresh token con usuario inactivo/no encontrado');
    throw new ApiError(401, 'Usuario no disponible');
  }

  logger.info({ userId: user.id }, 'Refresh token validado');

  return {
    user,
    tokens: buildTokens(user)
  };
}

async function getProfile(userId) {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(404, 'Usuario no encontrado');
  }
  return user;
}

module.exports = {
  login,
  refreshSession,
  getProfile
};
