const router = require('express').Router()
const ctrls = require('../controllers/brand')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require("../config/cloudinary_config.js");

router.post('/', [verifyAccessToken, isAdmin],uploader.single("image"), ctrls.createNewBrand)
router.get('/', ctrls.getAllBrand)
router.put('/:bid', [verifyAccessToken, isAdmin],uploader.single("image"), ctrls.updateBrand)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBrand)

module.exports = router