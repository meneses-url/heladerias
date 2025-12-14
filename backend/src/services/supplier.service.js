const prisma = require('../lib/prisma');
const ApiError = require('../utils/apiError');

async function listSuppliers() {
  return prisma.supplier.findMany({
    orderBy: { name: 'asc' }
  });
}

async function createSupplier(data) {
  const exists = await prisma.supplier.findFirst({
    where: { name: data.name }
  });

  if (exists) {
    throw new ApiError(409, 'Ya existe un proveedor con ese nombre');
  }

  return prisma.supplier.create({
    data: {
      name: data.name,
      contact: data.contact,
      phone: data.phone,
      email: data.email
    }
  });
}

module.exports = {
  listSuppliers,
  createSupplier
};
