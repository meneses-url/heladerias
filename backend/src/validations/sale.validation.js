const { z } = require('zod');

const saleItemSchema = z.object({
  variantId: z.coerce.number().int('variantId inválido'),
  quantity: z.coerce
    .number()
    .int('La cantidad debe ser entera')
    .positive('Cantidad inválida'),
  unitPrice: z.coerce.number().positive().optional()
});

const createSaleSchema = z.object({
  body: z.object({
    date: z
      .preprocess((value) => (value ? new Date(value) : new Date()), z.date())
      .optional(),
    paymentType: z.enum(['CASH', 'CARD', 'TRANSFER', 'MIXED']),
    notes: z.string().optional(),
    shiftId: z.coerce.number().int().optional(),
    discount: z.coerce.number().min(0).optional(),
    couponCode: z.string().max(50).optional(),
    promoDescription: z.string().optional(),
    items: z.array(saleItemSchema).min(1, 'Agrega al menos un item')
  })
});

const listSaleSchema = z.object({
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional()
  })
});

module.exports = {
  createSaleSchema,
  listSaleSchema
};
