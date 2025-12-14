const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');

function buildMonthFilter(month) {
  if (!month) return undefined;
  const [year, monthNum] = month.split('-').map(Number);
  const start = new Date(Date.UTC(year, monthNum - 1, 1));
  const end = new Date(Date.UTC(year, monthNum, 1));
  return { gte: start, lt: end };
}

async function listFixedExpenses(query = {}) {
  const where = {};
  if (query.month) {
    where.month = buildMonthFilter(query.month);
  }

  return prisma.fixedExpense.findMany({
    where,
    orderBy: { month: 'desc' }
  });
}

async function createFixedExpense(payload) {
  const amount = new Prisma.Decimal(payload.amount);
  const expense = await prisma.fixedExpense.create({
    data: {
      month: payload.month,
      category: payload.category,
      amount,
      description: payload.description,
      attachment: payload.attachment
    }
  });

  return expense;
}

module.exports = {
  listFixedExpenses,
  createFixedExpense
};
