const Brand = require('../models/brand')
const asyncHandler = require('express-async-handler')

// const createNewBrand = asyncHandler(async(req, res) => {
//     const response = await Brand.create(req.body)
//     return res.json({
//         success: response ? true : false,
//         createdBrand: response ? response: 'Cannot Create New Brand! '
//     })
// })

const createNewBrand = async (req, res) => {
    try {
      const { title } = req.body;
      const image = req.file ? req.file.path : null; 
  
      console.log('Title:', title); 
      console.log('Image:', image); 
  
      if (!image) {
        return res.status(400).json({ success: false, message: 'Image is required' });
      }
  
      const newBrand = await Brand.create({
        title,
        image,
      });
  
      res.status(201).json({ success: true, brand: newBrand });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
   };

// const getAllBrand = asyncHandler(async(req, res) => {
//     const response = await Brand.find()
//     return res.json({
//         success: response ? true : false,
//         allbrand: response ? response: 'Cannot Get All Brand! '
//     })
// })

const getAllBrand = asyncHandler(async (req, res) => {
    try {
      const queries = { ...req.query };
      const excludeFields = ["limit", "sort", "page", "fields"];
      excludeFields.forEach((el) => delete queries[el]);
  
      // Advanced Filtering (price, etc.)
      let queryString = JSON.stringify(queries);
      queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (match) => `$${match}`
      );
      const formattedQueries = JSON.parse(queryString);
  
      if (queries?.title)
        formattedQueries.title = { $regex: queries.title, $options: "i" };
  
      let queryObject = {};
  
      if (queries?.q) {
        delete formattedQueries.q;
        queryObject = {
          $or: [
            { title: { $regex: queries.q, $options: "i" } },
          ],
        };
      }
  
      // Merge color filtering with other queries
      const finalQuery = {
        ...formattedQueries,
        ...queryObject,
      };
  
      // Building the query
      let queryCommand = Brand.find(finalQuery);
  
      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
      } else {
        queryCommand = queryCommand.sort("-createdAt");
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
      const limit = parseInt(req.query.limit);
      const skip = (page - 1) * limit;
      queryCommand = queryCommand.skip(skip).limit(limit);
  
      // Execute query
      const brands = await queryCommand.exec();
      const counts = await Brand.countDocuments(finalQuery);
  
      // Response
      return res.status(200).json({
        success: true,
        allbrand: brands,
        counts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

// const updateBrand = asyncHandler(async(req, res) => {
//     const {bid} = req.params
//     const response = await Brand.findByIdAndUpdate(bid, req.body, {new: true})
//     return res.json({
//         success: response ? true : false,
//         updatedBrand: response ? response: 'Cannot Update Brand! '
//     })
// })

const updateBrand = async (req, res) => {
    try {
      const { bid } = req.params;
      const { title } = req.body;
      let updateData = { title };
  
      if (req.file) {
        updateData.image = req.file.path; 
      }
  
      const updatedBrand = await Brand.findByIdAndUpdate(bid, updateData, { new: true });
  
      if (!updatedBrand) {
        return res.status(404).json({ success: false, message: 'Brand not found' });
      }
  
      res.status(200).json({ success: true, brand: updatedBrand });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

const deleteBrand = asyncHandler(async(req, res) => {
    const {bid} = req.params
    const response = await Brand.findByIdAndDelete(bid)
    return res.json({
        success: response ? true : false,
        deletedBrand: response ? response: 'Cannot Delete Brand! '
    })
})

module.exports ={
    createNewBrand,
    getAllBrand,
    updateBrand,
    deleteBrand
}