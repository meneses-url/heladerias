const saleService = require('../services/sale.service');

async function listSales(req, res, next) {
  try {
    const data = await saleService.listSales(req.query);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function createSale(req, res, next) {
  try {
    const sale = await saleService.createSale(req.body, req.user?.id);
    res.status(201).json({ data: sale });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listSales,
  createSale
};
