const router = require('express').Router()
const ctrls = require('../controllers/order')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken], ctrls.createOrder)
router.get('/', [verifyAccessToken], ctrls.getOrderbyUser)
router.get('/admin', [verifyAccessToken, isAdmin], ctrls.getOrderbyAdmin)
router.get('/admin/order-today', [verifyAccessToken, isAdmin], ctrls.getOrdersToday)
router.get('/admin/profit', [verifyAccessToken, isAdmin], ctrls.calculateProfit)
router.get('/admin/daily-profit', [verifyAccessToken, isAdmin], ctrls.calculateDailyProfit)
router.get('/admin/weekly-profit', [verifyAccessToken, isAdmin], ctrls.calculateWeeklyProfit)
router.get('/admin/monthly-profit', [verifyAccessToken, isAdmin], ctrls.calculateMonthlyProfit)
router.get('/admin/yearly-profit', [verifyAccessToken, isAdmin], ctrls.calculateYearlyProfit)
router.put('/status/:oid', [verifyAccessToken], ctrls.updateStatus)
router.put('/paymentStatus/:oid', [verifyAccessToken], ctrls.updatePaymentStatus)
router.delete('/:oid', [verifyAccessToken], ctrls.cancelOrder);
router.get('/:oid', [verifyAccessToken], ctrls.getOrderDetail);


module.exports = router