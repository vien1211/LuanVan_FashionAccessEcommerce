const ProductCategory = require("../models/productCategory");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { response } = require("express");
const slugify = require("slugify");
// const createCategory = asyncHandler(async (req, res) => {
//   const response = await ProductCategory.create(req.body);
//   return res.json({
//     success: response ? true : false,
//     createdCategory: response
//       ? response
//       : "Cannot Create New Product Category! ",
//   });
// });

const createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.file ? req.file.path : null; // Access the path provided by Cloudinary
    req.body.slug = slugify(title);
    console.log('Title:', title); // Log title
    console.log('Image:', image); // Log image path

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const newCategory = await ProductCategory.create({
      title,
      image,
    });

    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
 };



// const getAllCategory = asyncHandler(async (req, res) => {
//   const response = await ProductCategory.find();

//   res.json({
//     success: response ? true : false,
//     prodCate: response || "Cannot Get Product Categories!",
//   });
// });

const getAllCategory = asyncHandler(async (req, res) => {
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
    let queryCommand = ProductCategory.find(finalQuery);

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
    const categories = await queryCommand.exec();
    const counts = await ProductCategory.countDocuments(finalQuery);

    // Response
    return res.status(200).json({
      success: true,
      prodCate: categories,
      counts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});





// const updateCategory = asyncHandler(async (req, res) => {
//   const { pcid } = req.params;
//   const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {
//     new: true,
//   });
//   return res.json({
//     success: response ? true : false,
//     updatedCategory: response
//       ? response
//       : "Cannot Update New Product Category! ",
//   });
// });

const updateCategory = async (req, res) => {
  try {
    const { pcid } = req.params;
    const { title } = req.body;
    let updateData = { title };

    if (req.file) {
      updateData.image = req.file.path; 
    }

    const updatedCategory = await ProductCategory.findByIdAndUpdate(pcid, updateData, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, category: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await ProductCategory.findByIdAndDelete(pcid);
  return res.json({
    success: response ? true : false,
    deletedCategory: response
      ? response
      : "Cannot Delete New Product Category! ",
  });
});

// const deleteCategory = async (req, res) => {
//   try {
//     const { pcid } = req.params;

//     // Find and delete the category
//     const deletedCategory = await ProductCategory.findByIdAndDelete(pcid);

//     if (!deletedCategory) {
//       return res.status(404).json({ success: false, message: 'Category not found' });
//     }

//     // Delete all products associated with the deleted category
//     const deleteResult = await Product.deleteMany({ category: pcid });

//     // Optional: Check if any products were deleted
//     if (deleteResult.deletedCount > 0) {
//       return res.status(200).json({
//         success: true,
//         message: 'Category and associated products deleted successfully',
//         deletedProductsCount: deleteResult.deletedCount,
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         message: 'Category deleted successfully, but no associated products were found',
//       });
//     }
//   } catch (error) {
//     console.error("Error deleting category:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };





module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
