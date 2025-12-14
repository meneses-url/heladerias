const { Router } = require('express');

const healthRouter = require('./health.routes');
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const productRouter = require('./product.routes');
const supplierRouter = require('./supplier.routes');
const purchaseRouter = require('./purchase.routes');
const saleRouter = require('./sale.routes');
const shiftRouter = require('./shift.routes');
const payrollRouter = require('./payroll.routes');
const fixedExpenseRouter = require('./fixedExpense.routes');
const salesGoalRouter = require('./salesGoal.routes');
const reportRouter = require('./report.routes');

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/suppliers', supplierRouter);
router.use('/purchases', purchaseRouter);
router.use('/sales', saleRouter);
router.use('/shifts', shiftRouter);
router.use('/payroll', payrollRouter);
router.use('/fixed-expenses', fixedExpenseRouter);
router.use('/sales-goals', salesGoalRouter);
router.use('/reports', reportRouter);

module.exports = router;
