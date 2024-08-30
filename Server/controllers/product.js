const Product = require("../models/product");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const makeSKU = require('uniqid')

const createProduct = asyncHandler(async (req, res) => {
  const { title, price, description, category, brand, quantity, color } =
    req.body;
  const images = req.files?.images?.map((el) => el.path);
  if (
    !(title && price && description && category && brand && quantity && color)
  )
    throw new Error("Mising inputs");
  req.body.slug = slugify(title);
  if (images) req.body.images = images;
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    mes: newProduct ? "Created" : "Cannot create new product",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid).populate({
    path: "ratings",
    populate: {
      path: "postedBy",
      select: "firstname lastname avatar",
    },
  });
  // if (!product || !product.category) {
  //   return res.status(404).send("Product not found or category no longer exists.");
  // }
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get product",
  });
});

const getAllProduct = asyncHandler(async (req, res) => {
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
    if (queries?.category)
      formattedQueries.category = { $regex: queries.category, $options: "i" };
    if (queries?.brand)
      formattedQueries.brand = { $regex: queries.brand, $options: "i" };
    
    let colorQueryObject = {};
    if (queries?.color) {
      const colorArr = queries.color.split(",");
      const colorQuery = colorArr.map((color) => ({
        color: { $regex: color, $options: "i" },
      }));
      colorQueryObject = { $or: colorQuery };
    }

    let queryObject = {};

    if (queries?.q) {
      delete formattedQueries.q;
      queryObject = {
        $or: [
          { color: { $regex: queries.q, $options: "i" } },
          { title: { $regex: queries.q, $options: "i" } },
          { category: { $regex: queries.q, $options: "i" } },
          { brand: { $regex: queries.q, $options: "i" } },
        ],
      };
    }

    // Merge color filtering with other queries
    const finalQuery = {
      ...colorQueryObject,
      ...formattedQueries,
      ...queryObject,
    };

    // Building the query
    let queryCommand = Product.find(finalQuery);

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
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    // Execute query
    const products = await queryCommand.exec();
    const counts = await Product.countDocuments(finalQuery);

    // Response
    return res.status(200).json({
      success: true,
      productData: products,
      counts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const files = req?.files;
  if (files?.images) req.body.images = files?.images?.map((el) => el.path);
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updateProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateProduct ? true : false,
    updateProduct: updateProduct ? updateProduct : "Cannot update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deleteProduct ? true : false,
    deleteProduct: deleteProduct ? "deleted" : "Cannot delete product",
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user; // User ID should be an ObjectId
  const { star, comment, pid, createdAt } = req.body; // Product ID should be an ObjectId

  if (!star || !pid || !comment) {
    return res.status(400).json({ success: false, message: "Missing Inputs" });
  }

  // Validate and convert to ObjectId
  if (
    !mongoose.Types.ObjectId.isValid(pid) ||
    !mongoose.Types.ObjectId.isValid(_id)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ObjectId" });
  }

  const productId = new mongoose.Types.ObjectId(pid);
  const userId = new mongoose.Types.ObjectId(_id);

  // Ensure star is a number
  const starNumber = parseFloat(star);
  if (isNaN(starNumber)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid star rating" });
  }

  try {
    const ratingProduct = await Product.findById(productId);
    if (!ratingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const alreadyRating = ratingProduct.ratings.some(
      (rating) => rating.postedBy.toString() === userId.toString()
    );

    if (alreadyRating) {
      // Update existing rating
      await Product.updateOne(
        { _id: productId, "ratings.postedBy": userId },
        {
          $set: {
            "ratings.$.star": starNumber,
            "ratings.$.comment": comment,
            "ratings.$.createdAt": createdAt,
          },
        }
      );
    } else {
      // Add new rating
      await Product.findByIdAndUpdate(productId, {
        $push: {
          ratings: { star: starNumber, comment, postedBy: userId, createdAt },
        },
      });
    }

    // Calculate average rating
    const updatedProduct = await Product.findById(productId);
    const ratingCount = updatedProduct.ratings.length;
    const sumRating = updatedProduct.ratings.reduce(
      (sum, el) => sum + el.star,
      0
    );
    updatedProduct.totalRatings =
      Math.round((sumRating / ratingCount) * 10) / 10;
    await updatedProduct.save();

    return res.status(200).json({
      success: true,
      updatedProduct,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit review. Please try again.",
    });
  }
});

const uploadimagesProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing Inputs");
  const response = await Product.findByIdAndUpdate(
    pid,
    { $push: { images: { $each: req.files.map((el) => el.path) } } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    updatedProduct: response ? response : "Cannot upload image product",
  });
});

const addVariant = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { title, price, color, quantity, sold } =
    req.body;
  const images = req.files?.images?.map((el) => el.path);
  if (
    !(title && price && color && quantity && sold)
  )
    throw new Error("Mising inputs");
  const response = await Product.findByIdAndUpdate(
    pid,
    { $push: { variant: {color, price, title, quantity, sold, images, sku: makeSKU().toUpperCase()} } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    response: response ? "Added Variant" : "Cannot upload image product",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  ratings,
  uploadimagesProduct,
  addVariant
};
