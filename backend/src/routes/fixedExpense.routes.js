const { Router } = require('express');
const fixedExpenseController = require('../controllers/fixedExpense.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const {
  createFixedExpenseSchema,
  listFixedExpenseSchema
} = require('../validations/fixedExpense.validation');

const router = Router();

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(listFixedExpenseSchema),
  fixedExpenseController.listFixedExpenses
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(createFixedExpenseSchema),
  fixedExpenseController.createFixedExpense
);

module.exports = router;
