const userService = require('../services/user.service');

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const payload = {
      ...req.body,
      createdById: req.user?.id
    };
    const user = await userService.createUser(payload);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsers,
  createUser
};
