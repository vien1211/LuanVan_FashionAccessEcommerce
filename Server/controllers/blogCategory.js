const mongoose = require('mongoose'); 
const BlogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async(req, res) => {
    const response = await BlogCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        createdCategory: response ? response: 'Cannot Create New Blog Category! '
    })
})

// const getAllCategory = asyncHandler(async(req, res) => {
//     const response = await BlogCategory.find().select('title _id')
//     return res.json({
//         success: response ? true : false,
//         blogCate: response ? response: 'Cannot Get All Blog Category! '
//     })
// })

const getAllCategory = asyncHandler(async (req, res) => {
    try {
      const queries = { ...req.query };
      const excludeFields = ["limit", "sort", "page", "fields"];
      excludeFields.forEach((el) => delete queries[el]);
  
      // Advanced Filtering (title, category, etc.)
      let queryString = JSON.stringify(queries);
      queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (match) => `$${match}`
      );
      const formattedQueries = JSON.parse(queryString);
  
      // Filtering by title or category if provided
      if (queries?.title)
        formattedQueries.title = { $regex: queries.title, $options: "i" };
      
      // Merging search queries if provided
      let queryObject = {};
      if (queries?.q) {
        delete formattedQueries.q;
        queryObject = {
          $or: [
            { title: { $regex: queries.q, $options: "i" } },
            
          ],
        };
      }
  
      // Merging all queries
      const finalQuery = {
        ...formattedQueries,
        ...queryObject,
      };
  
      // Building the query
      let queryCommand = BlogCategory.find(finalQuery); 
  
      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
      } else {
        queryCommand = queryCommand.sort("createdAt"); 
      }
  
      // Field Limiting
      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
      } else {
        queryCommand = queryCommand.select("-__v"); 
      }
  
      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10; 
      const skip = (page - 1) * limit;
      queryCommand = queryCommand.skip(skip).limit(limit);
  
      // Execute query
      const blogs = await queryCommand.exec();
      const counts = await BlogCategory.countDocuments(finalQuery); 
      // Response
      return res.status(200).json({
        success: true,
        blogCate: blogs,
        counts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

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