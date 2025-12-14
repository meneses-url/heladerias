const payrollService = require('../services/payroll.service');

async function listPayroll(req, res, next) {
  try {
    const data = await payrollService.listPayroll(req.query);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function createPayroll(req, res, next) {
  try {
    const payroll = await payrollService.createPayroll(req.body);
    res.status(201).json({ data: payroll });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listPayroll,
  createPayroll
};
