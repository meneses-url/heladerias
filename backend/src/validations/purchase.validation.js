const { z } = require('zod');

const purchaseItemSchema = z.object({
  description: z
    .string({ required_error: 'La descripción es obligatoria' })
    .min(3, 'Descripción muy corta'),
  category: z.string().optional(),
  quantity: z.coerce.number().positive('Cantidad inválida'),
  unit: z.string().optional(),
  unitCost: z.coerce.number().min(0, 'El costo debe ser mayor o igual a 0')
});

const createPurchaseSchema = z.object({
  body: z.object({
    supplierId: z.coerce.number().int().optional(),
    date: z
      .preprocess((value) => (value ? new Date(value) : new Date()), z.date())
      .optional(),
    reference: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(purchaseItemSchema).min(1, 'Agrega al menos un item')
  })
});

const listPurchaseSchema = z.object({
  query: z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/).optional()
  })
});

module.exports = {
  createPurchaseSchema,
  listPurchaseSchema
};
