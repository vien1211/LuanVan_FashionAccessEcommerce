const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[{
        product: {type: mongoose.Types.ObjectId, ref: 'Product'},
        quantity: Number,
        color: String,
        price: Number,
        image: String,
        title: String, 
    }],
    status:{
        type:String,
        default: 'Awaiting Confirmation',
        enum: ['Cancelled','Awaiting Confirmation', 'Processing', 'On The Way', 'Shipped', 'On Delivery', 'Delivered', 'Success']
    },
    total: Number,
    // coupon: {
    //     type: mongoose.Types.ObjectId, ref: 'Coupon'
    // },
    paymentMethod: {
        type: String,
        enum: ['paypal', 'cod'],
        // enum: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'],
        required: true
    },

    paymentStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Paid', 'Failed'],
    },
    
    orderBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    deliveryDate: {
        type: Date,  
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);