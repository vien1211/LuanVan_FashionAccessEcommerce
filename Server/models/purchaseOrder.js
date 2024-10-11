const mongoose = require('mongoose');

var purchaseOrderSchema = new mongoose.Schema({
    supplier:{ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    products: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: { type: Number, required: true },
          color: {type: String, required: true},
          price: {type: Number, required: true},
        }
      ],
    totalAmount: {type: Number, required: true}
}, {
    timestamps: true
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);