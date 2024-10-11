const router = require('express').Router()
const ctrls = require('../controllers/user')
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require("../config/cloudinary_config.js");

router.post('/register', ctrls.register)
router.get('/verifyregister/:token', ctrls.verifyregister)
router.post('/login', ctrls.login)
router.post('/google-login', ctrls.googleLogin)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.post('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers)
router.get('/user-today', [verifyAccessToken, isAdmin], ctrls.getUsersToday)
router.put('/current', [verifyAccessToken], uploader.single('avatar'), ctrls.updateUser)
router.put('/address', [verifyAccessToken], ctrls.updateUserAddress)
router.put('/cart', [verifyAccessToken], ctrls.updateCart)
router.delete('/:uid', [verifyAccessToken, isAdmin], ctrls.deleteUser)
router.put('/wishlist/:pid', [verifyAccessToken], ctrls.updateWishList)
router.delete('/remove-cart/:pid/:color', [verifyAccessToken], ctrls.removeProductInCart)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)


module.exports = router