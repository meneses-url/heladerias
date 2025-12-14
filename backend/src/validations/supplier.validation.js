const { z } = require('zod');

const createSupplierSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'El nombre es obligatorio' })
      .min(3, 'Nombre muy corto'),
    contact: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional()
  })
});

module.exports = {
  createSupplierSchema
};
