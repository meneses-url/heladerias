const { z } = require('zod');

const dateString = z
  .string()
  .min(1)
  .transform((value) => new Date(value));

const createShiftSchema = z.object({
  body: z.object({
    userId: z.coerce.number().int('userId inválido'),
    date: dateString,
    startTime: dateString,
    endTime: dateString,
    season: z.enum(['WEEKDAY', 'WEEKEND', 'HIGH', 'HOLIDAY', 'REGULAR']).optional(),
    notes: z.string().optional()
  })
});

const listShiftSchema = z.object({
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    userId: z.string().regex(/^[0-9]+$/).optional()
  })
});

const updateShiftStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9]+$/, 'Id inválido')
  }),
  body: z
    .object({
      status: z.enum(['SCHEDULED', 'COMPLETED', 'ABSENT']).optional(),
      checkInAt: z.string().optional(),
      checkOutAt: z.string().optional(),
      notes: z.string().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Debe enviar al menos un campo'
    })
});

module.exports = {
  createShiftSchema,
  listShiftSchema,
  updateShiftStatusSchema
};
