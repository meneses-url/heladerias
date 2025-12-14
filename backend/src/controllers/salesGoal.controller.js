const salesGoalService = require('../services/salesGoal.service');

async function listGoals(req, res, next) {
  try {
    const data = await salesGoalService.listGoals(req.query);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function createGoal(req, res, next) {
  try {
    const goal = await salesGoalService.createGoal(req.body);
    res.status(201).json({ data: goal });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listGoals,
  createGoal
};
