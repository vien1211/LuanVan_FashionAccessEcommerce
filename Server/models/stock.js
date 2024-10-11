const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var stockSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true },
}, {timestamps: true});

//Export the model
module.exports = mongoose.model('Stock', stockSchema);