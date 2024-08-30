const BlogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async(req, res) => {
    const response = await BlogCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        createdCategory: response ? response: 'Cannot Create New Blog Category! '
    })
})

const getAllCategory = asyncHandler(async(req, res) => {
    const response = await BlogCategory.find().select('title _id')
    return res.json({
        success: response ? true : false,
        blogCate: response ? response: 'Cannot Get All Blog Category! '
    })
})

const updateCategory = asyncHandler(async(req, res) => {
    const {bcid} = req.params
    const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updatedCategory: response ? response: 'Cannot Update Blog Category! '
    })
})

const deleteCategory = asyncHandler(async(req, res) => {
    const {bcid} = req.params
    const response = await BlogCategory.findByIdAndDelete(bcid)
    return res.json({
        success: response ? true : false,
        deletedCategory: response ? response: 'Cannot Delete Blog Category! '
    })
})

module.exports ={
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
}