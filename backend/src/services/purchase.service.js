const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');
const ApiError = require('../utils/apiError');
const logger = require('../lib/logger');

function parseMonthFilter(value) {
  if (!value) return undefined;
  const [year, month] = value.split('-').map(Number);
  if (!year || !month) {
    throw new ApiError(400, 'Parámetro month inválido (YYYY-MM)');
  }
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  return { gte: start, lt: end };
}

async function listPurchases(filters = {}) {
  const where = {};
  if (filters.month) {
    where.date = parseMonthFilter(filters.month);
  }

  const purchases = await prisma.purchase.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      supplier: true,
      items: true
    }
  });

  return purchases;
}

async function createPurchase(payload) {
  if (!payload.items || payload.items.length === 0) {
    throw new ApiError(400, 'Debes enviar al menos un item');
  }

  const normalizedItems = payload.items.map((item) => {
    const quantity = new Prisma.Decimal(item.quantity);
    const unitCost = new Prisma.Decimal(item.unitCost);
    return {
      description: item.description,
      category: item.category,
      quantity,
      unit: item.unit,
      unitCost,
      lineTotal: quantity.mul(unitCost)
    };
  });

  const total = normalizedItems.reduce(
    (acc, item) => acc.add(item.lineTotal),
    new Prisma.Decimal(0)
  );

  const purchase = await prisma.purchase.create({
    data: {
      supplierId: payload.supplierId || null,
      date: payload.date || new Date(),
      reference: payload.reference,
      notes: payload.notes,
      total,
      items: {
        create: normalizedItems.map((item) => ({
          description: item.description,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          unitCost: item.unitCost
        }))
      }
    }
  });

  logger.info({ purchaseId: purchase.id }, 'Compra registrada');

  return purchase;
}

module.exports = {
  listPurchases,
  createPurchase
};
