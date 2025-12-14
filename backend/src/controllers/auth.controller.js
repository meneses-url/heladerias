const authService = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshSession(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const profile = await authService.getProfile(req.user.id);
    res.json({ user: profile });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  refresh,
  me
};
