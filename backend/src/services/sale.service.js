const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');
const ApiError = require('../utils/apiError');
const logger = require('../lib/logger');

function parseDate(value) {
  if (!value) return new Date();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, 'Fecha inválida');
  }
  return date;
}

async function listSales(filters = {}) {
  const where = {};

  if (filters.from || filters.to) {
    where.date = {};
    if (filters.from) where.date.gte = new Date(filters.from);
    if (filters.to) where.date.lte = new Date(filters.to);
  }

  const sales = await prisma.sale.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      cashier: { select: { id: true, name: true } },
      items: {
        include: {
          variant: {
            select: {
              id: true,
              name: true,
              product: { select: { id: true, name: true } }
            }
          }
        }
      }
    }
  });

  return sales;
}

async function createSale(payload, userId) {
  if (!payload.items || payload.items.length === 0) {
    throw new ApiError(400, 'Ingresa al menos un item');
  }

  const variantIds = payload.items.map((item) => item.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds }, isActive: true }
  });

  if (variants.length !== variantIds.length) {
    throw new ApiError(404, 'Alguna variante no existe o está inactiva');
  }

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  const itemsPrepared = payload.items.map((item) => {
    const variant = variantMap.get(item.variantId);
    const unitPrice = item.unitPrice
      ? new Prisma.Decimal(item.unitPrice)
      : new Prisma.Decimal(variant.price);
    const quantity = new Prisma.Decimal(item.quantity);
    const lineTotal = unitPrice.mul(quantity);
    return {
      variant,
      quantity,
      unitPrice,
      lineTotal,
      payload: item
    };
  });

  const subtotal = itemsPrepared.reduce(
    (acc, item) => acc.add(item.lineTotal),
    new Prisma.Decimal(0)
  );

  const discount = payload.discount
    ? new Prisma.Decimal(payload.discount)
    : new Prisma.Decimal(0);

  if (discount.gt(subtotal)) {
    throw new ApiError(400, 'El descuento no puede superar el subtotal');
  }

  const total = subtotal.sub(discount);

  const sale = await prisma.sale.create({
    data: {
      date: parseDate(payload.date),
      paymentType: payload.paymentType,
      notes: payload.notes,
      cashierId: userId || null,
      shiftId: payload.shiftId || null,
      couponCode: payload.couponCode,
      promoDescription: payload.promoDescription,
      discount,
      total,
      items: {
        create: itemsPrepared.map((prepared) => ({
          variantId: prepared.payload.variantId,
          quantity: Number(prepared.quantity),
          unitPrice: prepared.unitPrice,
          total: prepared.lineTotal
        }))
      }
    },
    include: {
      items: true
    }
  });

  logger.info({ saleId: sale.id }, 'Venta registrada');

  return sale;
}

module.exports = {
  listSales,
  createSale
};
