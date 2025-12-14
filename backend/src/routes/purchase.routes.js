const { Router } = require('express');
const purchaseController = require('../controllers/purchase.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const {
  createPurchaseSchema,
  listPurchaseSchema
} = require('../validations/purchase.validation');

const router = Router();

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(listPurchaseSchema),
  purchaseController.listPurchases
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(createPurchaseSchema),
  purchaseController.createPurchase
);

module.exports = router;
