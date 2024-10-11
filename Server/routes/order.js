const router = require('express').Router()
const ctrls = require('../controllers/order')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken], ctrls.createOrder)
router.get('/', [verifyAccessToken], ctrls.getOrderbyUser)
router.get('/admin', [verifyAccessToken, isAdmin], ctrls.getOrderbyAdmin)
router.get('/admin/order-today', [verifyAccessToken, isAdmin], ctrls.getOrdersToday)
router.put('/status/:oid', [verifyAccessToken], ctrls.updateStatus)
router.put('/paymentStatus/:oid', [verifyAccessToken], ctrls.updatePaymentStatus)
router.delete('/:oid', [verifyAccessToken], ctrls.cancelOrder);
router.get('/:oid', [verifyAccessToken], ctrls.getOrderDetail);


module.exports = router