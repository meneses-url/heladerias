const { Router } = require('express');
const payrollController = require('../controllers/payroll.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const {
  createPayrollSchema,
  listPayrollSchema
} = require('../validations/payroll.validation');

const router = Router();

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(listPayrollSchema),
  payrollController.listPayroll
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(createPayrollSchema),
  payrollController.createPayroll
);

module.exports = router;
