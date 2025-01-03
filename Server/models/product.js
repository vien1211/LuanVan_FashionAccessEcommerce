const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    slug:{
        type:String,
        required:true,
        // unique:true,
        lowercase: true
    },
    description:{
        type:Array,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    // brand: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Brand',  // Referencing the Brand model
        
    // },
    price:{
        type:Number,
        default: 0
        // required:true
    },
    // category:{
    //     type:mongoose.Types.ObjectId,
    //     ref: 'ProductCategory'
    // },
     category:{
        type:String,
        required:true,
    },
    // stock: [{ 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Stock' 
    // }],
    sold:{
        type:Number,
        default: 0
    },
    images:{
        type:Array,
    },
    color:{
        type:String,
        require: true
    },
    ratings:[
        {
            star: {type: Number},
            postedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
            comment: {type: String},
            createdAt: {
                type: Date
            }
        }
    ],
    totalRatings: {
        type: Number,
        default: 0
    },
    variant: [
        {
            color: String,
            price: Number,
            images: Array,
            // quantity: Number,
            sold: Number,
            title: String,
            sku: String
        }
    ],
    //stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);