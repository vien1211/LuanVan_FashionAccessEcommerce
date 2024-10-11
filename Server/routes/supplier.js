const router = require('express').Router()
const ctrls = require('../controllers/supplier')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.addSupplier)
router.get('/', ctrls.getSuppliers)
router.put('/:sid', [verifyAccessToken, isAdmin], ctrls.updateSupplier)
router.delete('/:sid', [verifyAccessToken, isAdmin], ctrls.deleteSupplier)

module.exports = router