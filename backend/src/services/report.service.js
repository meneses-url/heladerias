const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');

function getMonthRange(month) {
  const [year, monthNum] = month.split('-').map(Number);
  if (!year || !monthNum) {
    throw new Error('Mes inválido');
  }
  const start = new Date(Date.UTC(year, monthNum - 1, 1));
  const end = new Date(Date.UTC(year, monthNum, 1));
  return { start, end };
}

async function getMonthlySummary(month) {
  const { start, end } = getMonthRange(month);

  const [salesAgg, purchaseAgg, fixedExpAgg, payrollAgg, goals] =
    await Promise.all([
      prisma.sale.aggregate({
        _sum: { total: true, discount: true },
        where: { date: { gte: start, lt: end } }
      }),
      prisma.purchase.aggregate({
        _sum: { total: true },
        where: { date: { gte: start, lt: end } }
      }),
      prisma.fixedExpense.aggregate({
        _sum: { amount: true },
        where: { month: { gte: start, lt: end } }
      }),
      prisma.payroll.aggregate({
        _sum: { amount: true },
        where: { periodMonth: { gte: start, lt: end } }
      }),
      prisma.salesGoal.findMany({
        where: { date: { gte: start, lt: end } },
        orderBy: { date: 'asc' }
      })
    ]);

  const salesTotal = salesAgg._sum.total || new Prisma.Decimal(0);
  const discountTotal = salesAgg._sum.discount || new Prisma.Decimal(0);
  const purchasesTotal = purchaseAgg._sum.total || new Prisma.Decimal(0);
  const fixedExpensesTotal = fixedExpAgg._sum.amount || new Prisma.Decimal(0);
  const payrollTotal = payrollAgg._sum.amount || new Prisma.Decimal(0);

  const net = salesTotal
    .sub(discountTotal)
    .sub(purchasesTotal)
    .sub(fixedExpensesTotal)
    .sub(payrollTotal);

  return {
    month,
    totals: {
      sales: salesTotal,
      discounts: discountTotal,
      purchases: purchasesTotal,
      fixedExpenses: fixedExpensesTotal,
      payroll: payrollTotal,
      netProfit: net
    },
    goals
  };
}

async function getSalesByProduct(month) {
  const { start, end } = getMonthRange(month);

  const items = await prisma.saleItem.findMany({
    where: {
      sale: {
        date: { gte: start, lt: end }
      }
    },
    include: {
      variant: {
        select: {
          id: true,
          name: true,
          product: { select: { id: true, name: true } }
        }
      }
    }
  });

  const summaryMap = new Map();

  for (const item of items) {
    const key = item.variantId;
    const current = summaryMap.get(key) || {
      productId: item.variant.product.id,
      productName: item.variant.product.name,
      variantId: item.variantId,
      variantName: item.variant.name,
      quantity: 0,
      revenue: new Prisma.Decimal(0)
    };

    current.quantity += item.quantity;
    current.revenue = current.revenue.add(item.total);

    summaryMap.set(key, current);
  }

  return Array.from(summaryMap.values()).sort((a, b) =>
    b.revenue.comparedTo(a.revenue)
  );
}

module.exports = {
  getMonthlySummary,
  getSalesByProduct
};
