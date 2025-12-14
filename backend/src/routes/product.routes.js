const { Router } = require('express');
const productController = require('../controllers/product.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const {
  createProductSchema,
  createVariantSchema
} = require('../validations/product.validation');

const router = Router();

router.get('/', authenticate, productController.listProducts);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(createProductSchema),
  productController.createProduct
);

router.get(
  '/:productId/variants',
  authenticate,
  validateRequest(createVariantSchema.pick({ params: true })),
  productController.listVariants
);

router.post(
  '/:productId/variants',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(createVariantSchema),
  productController.createVariant
);

module.exports = router;
