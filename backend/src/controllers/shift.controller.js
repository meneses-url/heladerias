const shiftService = require('../services/shift.service');

async function listShifts(req, res, next) {
  try {
    const data = await shiftService.listShifts(req.query, req.user);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function createShift(req, res, next) {
  try {
    const shift = await shiftService.createShift(req.body, req.user?.id);
    res.status(201).json({ data: shift });
  } catch (error) {
    next(error);
  }
}

async function updateShift(req, res, next) {
  try {
    const id = Number(req.params.id);
    const shift = await shiftService.updateShift(id, req.body);
    res.json({ data: shift });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listShifts,
  createShift,
  updateShift
};
