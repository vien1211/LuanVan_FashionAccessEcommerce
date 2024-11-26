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
        enum: ['Cancelled','Awaiting Confirmation', 'Confirmed', 'Shipped Out', 'On Delivery', 'Delivered', 'Success']
    },
    statusHistory: [ 
        {
            status: { type: String, required: true }, 
            updatedAt: { type: Date, default: Date.now } 
        }
    ],
    total: Number,
    coupon: {
        type: mongoose.Types.ObjectId, ref: 'Coupon'
    },
    paymentMethod: {
        type: String,
        enum: ['paypal', 'cod'],
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