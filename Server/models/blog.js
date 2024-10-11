const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model

var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:[{
        type:String,
        required:true,
    }],
    category: {
        type: mongoose.Types.ObjectId, 
        ref: 'BlogCategory',
        required: true,
    },
    numberView:{
        type:Number,
        default: 0
    },
    
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref:'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref:'User'
        }
    ],
    likesCount: {
        type: Number,
        default: 0, 
    },
    dislikesCount: {
        type: Number,
        default: 0, 
    },
    image: {
        type: String,
        default: 'https://previews.123rf.com/images/peshkov/peshkov1910/peshkov191000715/133391093-modern-blogging-sketch-on-white-wall-background-blog-and-media-concept-3d-rendering.jpg'
    },
    // author: {
    //     type: String,
    //     default: 'Admin'
    // },
    author: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true // Ensure this field is required
    },
    // comment:[
    //     {
    //         postedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
    //         content: {type: String},
    //         createdAt: {
    //             type: Date
    //         }
    //     }
    // ],
    comment: [
        {
          content: String,
          postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          createdAt: { type: Date, default: Date.now },
          reply: [
            {
              content: String,
              postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
              createdAt: { type: Date, default: Date.now },
            },
          ],
        },
      ],
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);