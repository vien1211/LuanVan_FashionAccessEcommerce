const router = require('express').Router()
const ctrls = require('../controllers/productCategory')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require("../config/cloudinary_config.js");

router.post('/', [verifyAccessToken, isAdmin],uploader.single("image"), ctrls.createCategory)
router.get('/', ctrls.getAllCategory)
router.put('/:pcid', [verifyAccessToken, isAdmin], uploader.single("image"), ctrls.updateCategory)
router.delete('/:pcid', [verifyAccessToken, isAdmin], ctrls.deleteCategory)

module.exports = router