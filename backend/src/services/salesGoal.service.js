const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');

function buildMonthRange(month) {
  if (!month) return undefined;
  const [year, monthNum] = month.split('-').map(Number);
  const start = new Date(Date.UTC(year, monthNum - 1, 1));
  const end = new Date(Date.UTC(year, monthNum, 1));
  return { gte: start, lt: end };
}

async function listGoals(query = {}) {
  const where = {};
  if (query.month) {
    where.date = buildMonthRange(query.month);
  }

  return prisma.salesGoal.findMany({
    where,
    orderBy: { date: 'desc' }
  });
}

async function createGoal(payload) {
  const goal = await prisma.salesGoal.create({
    data: {
      date: payload.date,
      target: new Prisma.Decimal(payload.target),
      description: payload.description
    }
  });

  return goal;
}

module.exports = {
  listGoals,
  createGoal
};
