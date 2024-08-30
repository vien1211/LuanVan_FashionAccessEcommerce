const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async(req, res) => {
    const { title, description, category} = req.body
    if(!title || !description || !category) throw new Error('Missing Inputs!')
    const response = await Blog.create(req.body)
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response: 'Cannot Create New Blog! '
    })
})

const updateBlog = asyncHandler(async(req, res) => {
    const {bid} = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Missing Inputs!')
    const response = await Blog.findByIdAndUpdate(bid, req.body, {new:true})
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response: 'Cannot Update Blog!'
    })
})

const getAllBlog = asyncHandler(async(req, res) => {
    const response = await Blog.find()
    return res.json({
        success: response ? true : false,
        AllBlog: response ? response: 'Cannot Get All Blog!'
    })
})

const likeBlog = asyncHandler(async(req, res) => {
    const { _id } = req.user
    const { bid } = req.params
    console.log(bid)
    if(!bid) throw new Error('Missing Inputs')
    const blog = await Blog.findById(bid)
    const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if(alreadyDisliked){
        const response = await Blog.findByIdAndUpdate(bid, { $pull: {dislikes: _id} }, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isLiked = blog?.likes.find(el => el.toString() === _id)
    if(isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id}, }, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, {$push: {likes: _id}, }, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})

const dislikeBlog = asyncHandler(async(req, res) => {
    const { _id } = req.user
    const { bid } = req.params
    if(!bid) throw new Error('Missing Inputs')
    const blog = await Blog.findById(bid)
    const alreadyLiked = blog?.likes?.find(el => el.toString() === _id)
    if(alreadyLiked){
        const response = await Blog.findByIdAndUpdate(bid, { $pull: {likes: _id} }, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isDisliked = blog?.disLikes?.find(el => el.toString() === _id)
    if(isDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: {disLikes: _id}, }, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: {disLikes: _id}, }, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})
//const excludeFields = '-refreshToken -password -role -createdAt -updatedAt'
const getBlog = asyncHandler(async(req, res) => {
    const { bid } = req.params
    const blog = await Blog.findByIdAndUpdate(bid, {$inc: {numberView: 1}}, {new: true})
        .populate('likes', 'firstname lastname')
        .populate('disLikes', 'firstname lastname')
    return res.json({
        success: blog ? true : false,
        rs: blog
    })
})

const deleteBlog = asyncHandler(async(req, res) => {
    const { bid } = req.params
    const blog = await Blog.findByIdAndDelete(bid)
    return res.json({
        success: blog ? true : false,
        deleteBlog: blog || 'Something went wrong'
    })
})

const uploadimagesBlog = asyncHandler(async(req, res) => {
    const { bid } = req.params
    if(!req.file) throw new Error('Missing Inputs')
      const response = await Blog.findByIdAndUpdate(bid, { image: req.file.path }, {new: true})
      return res.status(200).json({
        status: response ? true : false,
        updatedBlog: response ? response : 'Cannot upload image Blog'
    })
  })

module.exports ={
    createNewBlog,
    updateBlog,
    getAllBlog,
    likeBlog,
    dislikeBlog,
    getBlog,
    deleteBlog,
    uploadimagesBlog

}
