const router = require('express').Router()
const ctrls = require('../controllers/purchaseOrder')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createPurchaseOrder)
router.get('/', ctrls.getReceipts)
// router.put('/:sid', [verifyAccessToken, isAdmin], ctrls.updateSupplier)
// router.delete('/:sid', [verifyAccessToken, isAdmin], ctrls.deleteSupplier)

module.exports = router