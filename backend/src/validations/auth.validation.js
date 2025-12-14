const { z } = require('zod');

const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'El email es obligatorio' })
      .email('Email inválido'),
    password: z
      .string({ required_error: 'La contraseña es obligatoria' })
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
  })
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z
      .string({ required_error: 'Refresh token requerido' })
      .min(20, 'Refresh token inválido')
  })
});

module.exports = {
  loginSchema,
  refreshSchema
};
