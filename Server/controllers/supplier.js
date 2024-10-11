const Supplier = require("../models/supplier.js");
const asyncHandler = require("express-async-handler");
const { response } = require("express");

const addSupplier = async (req, res) => {
  try {
    const { name, contact, address } = req.body;
    const newSupplier = await Supplier.create({
      name,
      contact,
      address,
    });

    res.status(201).json({ success: true, supplier: newSupplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const getSuppliers = async (req, res) => {   
//   const response = await Supplier.find();
//   res.json({
//     success: response ? true : false,
//     suppliers: response || "Cannot Get Product Categories!",
//   });

// }

const getSuppliers = asyncHandler(async (req, res) => {
  try {
    const queries = { ...req.query };
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );
    const formattedQueries = JSON.parse(queryString);

    // Filtering
    if (queries?.name)
      formattedQueries.name = { $regex: queries.name, $options: "i" };

    if (req.query.q) {
      delete formattedQueries.q;
      formattedQueries["$or"] = [
        { name: { $regex: req.query.q, $options: "i" } },
        { email: { $regex: req.query.q, $options: "i" } },
        { address: { $regex: req.query.q, $options: "i" } },
        { contact: { $regex: req.query.q, $options: "i" } },
      ];
    }

    let queryCommand = Supplier.find(formattedQueries);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    } else {
      queryCommand = queryCommand.sort("-createdAt");
    }

    // Field limiting
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

    const suppliers = await queryCommand.exec();
    const counts = await Supplier.countDocuments(formattedQueries);

    return res.status(200).json({
      success: true,
      suppliers: suppliers,
      counts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const updateSupplier = asyncHandler(async (req, res) => {
  const { sid } = req.params;
  const response = await Supplier.findByIdAndUpdate(sid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedSupplier: response
      ? response
      : "Cannot Update New Product Category! ",
  });
});

const deleteSupplier = asyncHandler(async(req, res) => {
    const {sid} = req.params
    const response = await Supplier.findByIdAndDelete(sid)
    return res.json({
        success: response ? true : false,
        deletedSupplier: response ? response: 'Cannot Deleted Supplier! '
    })
})
module.exports = {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
};
