const reportService = require('../services/report.service');

async function monthlySummary(req, res, next) {
  try {
    const data = await reportService.getMonthlySummary(req.query.month);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function salesByProduct(req, res, next) {
  try {
    const data = await reportService.getSalesByProduct(req.query.month);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  monthlySummary,
  salesByProduct
};
