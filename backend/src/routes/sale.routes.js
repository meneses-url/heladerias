const { Router } = require('express');
const saleController = require('../controllers/sale.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate } = require('../middlewares/auth');
const { createSaleSchema, listSaleSchema } = require('../validations/sale.validation');

const router = Router();

router.get(
  '/',
  authenticate,
  validateRequest(listSaleSchema),
  saleController.listSales
);

router.post(
  '/',
  authenticate,
  validateRequest(createSaleSchema),
  saleController.createSale
);

module.exports = router;
