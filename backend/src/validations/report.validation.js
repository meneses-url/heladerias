const { z } = require('zod');

const monthlySummarySchema = z.object({
  query: z.object({
    month: z
      .string({ required_error: 'El mes es obligatorio' })
      .regex(/^\d{4}-\d{2}$/)
  })
});

const salesByProductSchema = z.object({
  query: z.object({
    month: z
      .string({ required_error: 'El mes es obligatorio' })
      .regex(/^\d{4}-\d{2}$/)
  })
});

module.exports = {
  monthlySummarySchema,
  salesByProductSchema
};
