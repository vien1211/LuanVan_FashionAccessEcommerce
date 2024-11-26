const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        uppercase: true
    },
    discount:{
        type:Number,
        required:true,
    },
    expire:{
        type:Date,
        required:true,
    },
    usageLimit: { // Số lần sử dụng tối đa của coupon
        type: Number,
        required: true,
        default: 1
    },
    usedBy: { // Danh sách người dùng đã sử dụng coupon này
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    usedCount: { // Số lần coupon đã được sử dụng
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);