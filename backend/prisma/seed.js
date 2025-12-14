require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/password');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@dulce.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const name = process.env.SEED_ADMIN_NAME || 'Administrador';

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Ya existe un usuario con el email ${email}`);
    return;
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log(`Usuario admin creado (${email}). Contraseña: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
