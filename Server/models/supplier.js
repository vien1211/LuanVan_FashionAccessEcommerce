const mongoose = require('mongoose');

var supplierSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
    },
    address:{
        type: String
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Supplier', supplierSchema);