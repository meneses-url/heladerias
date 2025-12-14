const { Router } = require('express');
const supplierController = require('../controllers/supplier.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const { createSupplierSchema } = require('../validations/supplier.validation');

const router = Router();

router.get('/', authenticate, supplierController.listSuppliers);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(createSupplierSchema),
  supplierController.createSupplier
);

module.exports = router;
