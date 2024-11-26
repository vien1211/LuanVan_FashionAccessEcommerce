const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

// const createNewCoupon = asyncHandler(async(req, res) => {
//     const { name, discount, expire} = req.body
//     if(!name || !discount || !expire) throw new Error('Missing Inputs!')
//     const response = await Coupon.create({
//         ...req.body,
//         expire: Date.now() + +expire*24*60*60*1000
//     })
//     return res.json({
//         success: response ? true : false,
//         createdCoupon: response ? response: 'Cannot Create New Coupon! '
//     })
// })

const createNewCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expire, usageLimit } = req.body;
    if (!name || !discount || !expire || !usageLimit) throw new Error('Missing Inputs!');

    // Convert the expire date from the request body to a timestamp
    const expireDate = new Date(expire).getTime();

    const response = await Coupon.create({
        ...req.body,
        expire: expireDate, 
        usedCount: 0
    });

    return res.json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Cannot Create New Coupon! ',
    });
});


const getAllCoupon = asyncHandler(async(req, res) => {
    const response = await Coupon.find()
    return res.json({
        success: response ? true : false,
        AllCoupon: response ? response: 'Cannot Get Coupon! '
    })
})

// const updateCoupon = asyncHandler(async(req, res) => {
//     const {cid} = req.params
//     if(Object.keys(req.body).length === 0) throw new Error('Missing Inputs')
//     if(req.body.expire) req.body.expire = Date.now() + +req.body.expire*24*60*60*1000
//     const response = await Coupon.findByIdAndUpdate(cid, req.body, {new: true})
//     return res.json({
//         success: response ? true : false,
//         updatedCoupon: response ? response: 'Cannot Update Coupon! '
//     })
// })

const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    
    if (Object.keys(req.body).length === 0) throw new Error('Missing Inputs');

    // If the expire date is provided, convert it to a timestamp
    if (req.body.expire) {
        const expireDate = new Date(req.body.expire).getTime(); // Convert to milliseconds
        req.body.expire = expireDate; // Update req.body.expire with the timestamp
    }

    const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });

    return res.json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Cannot Update Coupon! ',
    });
});


const deleteCoupon = asyncHandler(async(req, res) => {
    const {cid} = req.params
    const response = await Coupon.findByIdAndDelete(cid)
    return res.json({
        success: response ? true : false,
        deletedCoupon: response ? response: 'Cannot Deleted Coupon! '
    })
})

const applyCoupon = asyncHandler(async (req, res) => {
    const { userId, couponId } = req.body; // Using couponId as the parameter

    // Find coupon by ID
    const coupon = await Coupon.findById(couponId); // Use findById for couponId

    if (!coupon) {
        return res.status(404).json({ success: false, message: 'Coupon not found!' });
    }
    if (new Date(coupon.expire) < new Date()) {
        return res.status(400).json({ success: false, message: 'Coupon has expired!' });
    }
    if (coupon.usageLimit <= coupon.usedBy.length) {
        return res.status(400).json({ success: false, message: 'Coupon usage limit reached!' });
    }
    if (coupon.usedBy.includes(userId)) {
        return res.status(400).json({ success: false, message: 'Coupon already used by this account!' });
    }

    // All conditions are satisfied, apply the coupon
    coupon.usedBy.push(userId); // Add userId to the usedBy array
    await coupon.save(); // Save the updated coupon

    // Return coupon information with the discount
    return res.json({
        success: true,
        message: 'Coupon is valid and has been applied.',
        discount: coupon.discount
    });
});





module.exports ={
    createNewCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon,
    applyCoupon
}
