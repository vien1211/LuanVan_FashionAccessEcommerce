const router = require('express').Router()
const ctrls = require('../controllers/stock')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.get('/', [verifyAccessToken, isAdmin], ctrls.getStock)
// router.get('/', ctrls.getSuppliers)
// router.put('/:sid', [verifyAccessToken, isAdmin], ctrls.updateSupplier)
router.delete('/:stockId', [verifyAccessToken, isAdmin], ctrls.deleteStockById)

module.exports = router