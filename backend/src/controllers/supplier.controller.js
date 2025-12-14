const supplierService = require('../services/supplier.service');

async function listSuppliers(req, res, next) {
  try {
    const data = await supplierService.listSuppliers();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function createSupplier(req, res, next) {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json({ data: supplier });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listSuppliers,
  createSupplier
};
