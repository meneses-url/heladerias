const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');
const ApiError = require('../utils/apiError');

function buildMonthRange(month) {
  if (!month) return undefined;
  const [year, monthNum] = month.split('-').map(Number);
  if (!year || !monthNum) return undefined;
  const start = new Date(Date.UTC(year, monthNum - 1, 1));
  const end = new Date(Date.UTC(year, monthNum, 1));
  return { gte: start, lt: end };
}

async function listPayroll(query = {}) {
  const where = {};
  if (query.month) {
    where.periodMonth = buildMonthRange(query.month);
  }

  const payrolls = await prisma.payroll.findMany({
    where,
    orderBy: { periodMonth: 'desc' },
    include: {
      user: { select: { id: true, name: true } },
      shift: { select: { id: true, date: true } }
    }
  });

  return payrolls;
}

async function createPayroll(payload) {
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new ApiError(404, 'Usuario no encontrado');
  }

  const amount = new Prisma.Decimal(payload.amount);

  const payroll = await prisma.payroll.create({
    data: {
      userId: payload.userId,
      shiftId: payload.shiftId || null,
      periodMonth: payload.periodMonth,
      amount,
      method: payload.method,
      notes: payload.notes
    }
  });

  return payroll;
}

module.exports = {
  listPayroll,
  createPayroll
};
