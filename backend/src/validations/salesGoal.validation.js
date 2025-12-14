const { z } = require('zod');

const createSalesGoalSchema = z.object({
  body: z.object({
    date: z
      .string()
      .min(1)
      .transform((value) => new Date(value)),
    target: z.coerce.number().positive('El objetivo debe ser mayor a 0'),
    description: z.string().optional()
  })
});

const listSalesGoalSchema = z.object({
  query: z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/).optional()
  })
});

module.exports = {
  createSalesGoalSchema,
  listSalesGoalSchema
};
