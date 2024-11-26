const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const ctrls = require('../controllers/coupon')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewCoupon)
router.get('/', ctrls.getAllCoupon)
router.post('/apply', ctrls.applyCoupon)
router.put('/:cid', [verifyAccessToken, isAdmin], ctrls.updateCoupon)
router.delete('/:cid', [verifyAccessToken, isAdmin], ctrls.deleteCoupon)

module.exports = router