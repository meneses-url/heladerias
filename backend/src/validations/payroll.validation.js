const { z } = require('zod');

const createPayrollSchema = z.object({
  body: z.object({
    userId: z.coerce.number().int('userId inválido'),
    shiftId: z.coerce.number().int().optional(),
    periodMonth: z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .transform((value) => new Date(`${value}-01T00:00:00Z`)),
    amount: z.coerce.number().positive('Monto inválido'),
    method: z.enum(['CASH', 'TRANSFER', 'OTHER']),
    notes: z.string().optional()
  })
});

const listPayrollSchema = z.object({
  query: z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/).optional()
  })
});

module.exports = {
  createPayrollSchema,
  listPayrollSchema
};
