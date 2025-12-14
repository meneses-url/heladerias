const productService = require('../services/product.service');

async function listProducts(req, res, next) {
  try {
    const products = await productService.listProducts();
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
}

async function createVariant(req, res, next) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const variant = await productService.createVariant(productId, req.body);
    res.status(201).json({ data: variant });
  } catch (error) {
    next(error);
  }
}

async function listVariants(req, res, next) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const variants = await productService.listVariants(productId);
    res.json({ data: variants });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  createProduct,
  createVariant,
  listVariants
};
