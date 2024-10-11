const userRouter = require('./user')
const productRouter = require('./product')
const productCategoryRouter = require('./productCategory')
const blogCategoryRouter = require('./blogCategory')
const blogRouter = require('./blog')
const brandRouter = require('./brand')
const couponRouter = require('./coupon')
const orderRouter = require('./order')
const supplierRouter = require('./supplier')
const stockRouter = require('./stock')
const purchaseOrderRouter = require('./purchaseOrder')
const {notFound, errHandler} = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/productcategory', productCategoryRouter)
    app.use('/api/blogcategory', blogCategoryRouter)
    app.use('/api/blogs', blogRouter)
    app.use('/api/brand', brandRouter)
    app.use('/api/coupon', couponRouter)
    app.use('/api/order', orderRouter)
    app.use('/api/supplier', supplierRouter)
    app.use('/api/stock', stockRouter)
    app.use('/api/purchaseorder', purchaseOrderRouter)
    app.use('/api/auth', userRouter);

    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes