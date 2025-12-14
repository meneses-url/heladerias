const prisma = require('../lib/prisma');
const ApiError = require('../utils/apiError');

function buildDateFilter(from, to) {
  if (!from && !to) return undefined;
  const filter = {};
  if (from) filter.gte = new Date(from);
  if (to) filter.lte = new Date(to);
  return filter;
}

async function listShifts(filters = {}, currentUser) {
  const where = {};

  if (filters.from || filters.to) {
    where.date = buildDateFilter(filters.from, filters.to);
  }

  if (filters.userId) {
    where.userId = Number(filters.userId);
  } else if (currentUser?.role === 'CASHIER') {
    where.userId = currentUser.id;
  }

  const shifts = await prisma.shift.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } }
    }
  });

  return shifts;
}

async function createShift(payload, createdById) {
  if (payload.endTime <= payload.startTime) {
    throw new ApiError(400, 'La hora de fin debe ser mayor a la de inicio');
  }

  const shift = await prisma.shift.create({
    data: {
      userId: payload.userId,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      season: payload.season || 'REGULAR',
      notes: payload.notes,
      createdById
    }
  });

  return shift;
}

async function updateShift(id, data) {
  const existing = await prisma.shift.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, 'Turno no encontrado');
  }

  const payload = {};
  if (data.status) payload.status = data.status;
  if (data.checkInAt) payload.checkInAt = new Date(data.checkInAt);
  if (data.checkOutAt) payload.checkOutAt = new Date(data.checkOutAt);
  if (data.notes !== undefined) payload.notes = data.notes;

  const updated = await prisma.shift.update({
    where: { id },
    data: payload
  });

  return updated;
}

module.exports = {
  listShifts,
  createShift,
  updateShift
};
