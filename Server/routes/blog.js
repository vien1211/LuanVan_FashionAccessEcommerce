const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middlewares/verifyToken')
const ctrls = require('../controllers/blog')
const uploader = require('../config/cloudinary_config.js')

// router.post('/', [verifyAccessToken, isAdmin], uploader.single('image', 10), ctrls.createNewBlog)
router.post('/', [verifyAccessToken], uploader.single('image', 10), ctrls.createNewBlog)
router.get('/', ctrls.getAllBlog)
router.put('/comment', [verifyAccessToken], ctrls.comment);
router.put('/reply', [verifyAccessToken], ctrls.replyToComment);
router.get('/:bid', ctrls.getBlog)
router.put('/uploadimage/:bid', [verifyAccessToken, isAdmin], uploader.single('image', 10), ctrls.uploadimagesBlog)
router.put('/like/:bid', [verifyAccessToken], ctrls.likeBlog)
router.put('/dislike/:bid', [verifyAccessToken], ctrls.dislikeBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], uploader.single('image', 10),ctrls.updateBlog)
router.delete('/:bid', [verifyAccessToken], ctrls.deleteBlog)


module.exports = router