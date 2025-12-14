const { Router } = require('express');
const salesGoalController = require('../controllers/salesGoal.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const {
  createSalesGoalSchema,
  listSalesGoalSchema
} = require('../validations/salesGoal.validation');

const router = Router();

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(listSalesGoalSchema),
  salesGoalController.listGoals
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(createSalesGoalSchema),
  salesGoalController.createGoal
);

module.exports = router;
