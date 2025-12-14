const { z } = require('zod');

const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'El nombre es obligatorio' })
      .min(3, 'El nombre es muy corto'),
    category: z.string().optional(),
    description: z.string().optional()
  })
});

const createVariantSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'El nombre de la variante es obligatorio' })
      .min(2, 'Nombre demasiado corto'),
    price: z
      .string()
      .or(z.number())
      .transform((value) => Number(value))
      .refine((value) => !Number.isNaN(value) && value > 0, 'Precio inválido'),
    currency: z.string().default('COP')
  }),
  params: z.object({
    productId: z
      .string()
      .regex(/^[0-9]+$/, 'productId debe ser numérico')
  })
});

module.exports = {
  createProductSchema,
  createVariantSchema
};
