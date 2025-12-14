const prisma = require('../lib/prisma');
const ApiError = require('../utils/apiError');
const { hashPassword } = require('../utils/password');
const logger = require('../lib/logger');

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

function buildUserSelect(includePassword = false) {
  return {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
    ...(includePassword && { password: true })
  };
}

async function findUserByEmail(email, options = { includePassword: false }) {
  if (!email) return null;
  const user = await prisma.user.findUnique({
    where: { email },
    select: buildUserSelect(options.includePassword)
  });
  return user;
}

async function getUserById(id) {
  if (!id) return null;
  const user = await prisma.user.findUnique({
    where: { id },
    select: buildUserSelect(false)
  });
  return user;
}

async function listUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: buildUserSelect(false)
  });
  return users;
}

async function createUser(payload) {
  const existing = await findUserByEmail(payload.email);
  if (existing) {
    throw new ApiError(409, 'El email ya está registrado');
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
      isActive: true
    },
    select: buildUserSelect(false)
  });

  logger.info(
    { userId: user.id, createdBy: payload.createdById || 'system' },
    'Usuario creado'
  );

  return user;
}

module.exports = {
  sanitizeUser,
  findUserByEmail,
  getUserById,
  listUsers,
  createUser
};
