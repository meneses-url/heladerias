const { Router } = require('express');
const userController = require('../controllers/user.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const { createUserSchema } = require('../validations/user.validation');

const router = Router();

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  userController.listUsers
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(createUserSchema),
  userController.createUser
);

module.exports = router;
