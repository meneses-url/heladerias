const { z } = require('zod');

const roles = ['ADMIN', 'CASHIER'];

const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'El nombre es obligatorio' })
      .min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z
      .string({ required_error: 'El email es obligatorio' })
      .email('Email inválido'),
    password: z
      .string({ required_error: 'La contraseña es obligatoria' })
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z
      .enum(roles, {
        errorMap: () => ({ message: 'Rol inválido' })
      })
      .default('CASHIER')
  })
});

module.exports = {
  createUserSchema
};
