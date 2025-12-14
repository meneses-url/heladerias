const fixedExpenseService = require('../services/fixedExpense.service');

async function listFixedExpenses(req, res, next) {
  try {
    const data = await fixedExpenseService.listFixedExpenses(req.query);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function createFixedExpense(req, res, next) {
  try {
    const expense = await fixedExpenseService.createFixedExpense(req.body);
    res.status(201).json({ data: expense });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listFixedExpenses,
  createFixedExpense
};
