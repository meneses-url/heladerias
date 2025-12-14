const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate } = require('../middlewares/auth');
const { loginSchema, refreshSchema } = require('../validations/auth.validation');

const router = Router();

router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', validateRequest(refreshSchema), authController.refresh);
router.get('/me', authenticate, authController.me);

module.exports = router;
