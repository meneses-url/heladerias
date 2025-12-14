const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');
const ApiError = require('../utils/apiError');

async function listProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return products;
}

async function createProduct(data) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      category: data.category,
      description: data.description,
      isActive: true
    }
  });

  return product;
}

async function createVariant(productId, payload) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new ApiError(404, 'Producto no encontrado');
  }

  const variant = await prisma.productVariant.create({
    data: {
      productId,
      name: payload.name,
      price: new Prisma.Decimal(payload.price),
      currency: payload.currency || 'COP',
      isActive: true
    }
  });

  return variant;
}

async function listVariants(productId) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new ApiError(404, 'Producto no encontrado');
  }

  const variants = await prisma.productVariant.findMany({
    where: { productId, isActive: true },
    orderBy: { createdAt: 'asc' }
  });

  return variants;
}

module.exports = {
  listProducts,
  createProduct,
  createVariant,
  listVariants
};
