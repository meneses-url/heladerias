const { z } = require('zod');

const createFixedExpenseSchema = z.object({
  body: z.object({
    month: z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .transform((value) => new Date(`${value}-01T00:00:00Z`)),
    category: z.string({ required_error: 'La categoría es obligatoria' }),
    amount: z.coerce.number().min(0, 'El monto debe ser mayor o igual a 0'),
    description: z.string().optional(),
    attachment: z.string().optional()
  })
});

const listFixedExpenseSchema = z.object({
  query: z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/).optional()
  })
});

module.exports = {
  createFixedExpenseSchema,
  listFixedExpenseSchema
};
