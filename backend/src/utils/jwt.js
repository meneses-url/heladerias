const jwt = require('jsonwebtoken');
const ApiError = require('./apiError');
const config = require('../config');

const {
  accessSecret,
  refreshSecret,
  accessExpiresIn,
  refreshExpiresIn
} = config.security.jwt;

function signAccessToken(payload = {}) {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });
}

function signRefreshToken(payload = {}) {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, accessSecret);
  } catch (error) {
    throw new ApiError(401, 'Token inválido o expirado');
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, refreshSecret);
  } catch (error) {
    throw new ApiError(401, 'Refresh token inválido o expirado');
  }
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
