const purchaseService = require('../services/purchase.service');

async function listPurchases(req, res, next) {
  try {
    const data = await purchaseService.listPurchases(req.query);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function createPurchase(req, res, next) {
  try {
    const purchase = await purchaseService.createPurchase(req.body);
    res.status(201).json({ data: purchase });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listPurchases,
  createPurchase
};
