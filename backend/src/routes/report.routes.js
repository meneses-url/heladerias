const { Router } = require('express');
const reportController = require('../controllers/report.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const {
  monthlySummarySchema,
  salesByProductSchema
} = require('../validations/report.validation');

const router = Router();

router.get(
  '/monthly-summary',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(monthlySummarySchema),
  reportController.monthlySummary
);

router.get(
  '/sales-by-product',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(salesByProductSchema),
  reportController.salesByProduct
);

module.exports = router;
