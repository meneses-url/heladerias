const { Router } = require('express');
const shiftController = require('../controllers/shift.controller');
const validateRequest = require('../middlewares/validateRequest');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const {
  createShiftSchema,
  listShiftSchema,
  updateShiftStatusSchema
} = require('../validations/shift.validation');

const router = Router();

router.get(
  '/',
  authenticate,
  validateRequest(listShiftSchema),
  shiftController.listShifts
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(createShiftSchema),
  shiftController.createShift
);

router.patch(
  '/:id/attendance',
  authenticate,
  authorizeRoles('ADMIN'),
  validateRequest(updateShiftStatusSchema),
  shiftController.updateShift
);

module.exports = router;
