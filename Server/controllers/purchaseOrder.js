const PurchaseOrder = require("../models/purchaseOrder.js");
const Product = require("../models/product");
const Supplier = require("../models/supplier");
const Stock = require("../models/stock.js");
const asyncHandler = require("express-async-handler");

const createPurchaseOrder = asyncHandler(async (req, res) => {
  console.log("createPurchaseOrder called");
  const { supplier, products } = req.body;

  if (!supplier || !products || products.length === 0) {
    return res.status(400).json({ success: false, message: "Missing input" });
  }

  let totalAmount = 0;
  const processedProducts = [];
  const errors = [];

  await Promise.all(
    products.map(async (item) => {
      const product = await Product.findById(item.product).populate("variant");

      if (!product) {
        errors.push(`Product not found: ${item.product}`);
        return;
      }

      let variant = null;
      let price = Number(item.price);

      if (product.variant && product.variant.length > 0) {
        variant = product.variant.find(
          (v) => v.color.toLowerCase() === item.color.toLowerCase()
        );

        if (variant) {
          variant.quantity = (variant.quantity || 0) + Number(item.quantity);
          price = price || variant.price;

          totalAmount += item.quantity * price;

          await product.save();

          await saveOrUpdateStock(item.product, variant.color, item.quantity);

          processedProducts.push({
            product: product._id,
            color: variant.color,
            quantity: item.quantity,
            price,
          });

          return;
        }
      }

      if (product.color.toLowerCase() === item.color.toLowerCase()) {
        product.quantity = (product.quantity || 0) + Number(item.quantity);
        price = price || product.price;

        totalAmount += item.quantity * price;

        await product.save();

        await saveOrUpdateStock(item.product, product.color, item.quantity);

        processedProducts.push({
          product: product._id,
          color: product.color,
          quantity: item.quantity,
          price,
        });
      } else {
        errors.push(
          `No matching color for product: ${product.title}, color: ${item.color}`
        );
      }
    })
  );

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ success: false, message: "Some products failed", errors });
  }

  const newPurchaseOrder = new PurchaseOrder({
    supplier,
    products: processedProducts,
    totalAmount,
  });

  const savedOrder = await newPurchaseOrder.save();

  const populatedOrder = await PurchaseOrder.findById(savedOrder._id)
    .populate("supplier", "name")
    .populate("products.product", "title");

  return res.status(201).json({
    success: true,
    message: "Purchase order created successfully",
    purchaseOrder: populatedOrder,
  });
});

const saveOrUpdateStock = async (productId, color, quantity) => {
  try {
    const stockRecord = await Stock.findOne({
      product: productId,
      color: color,
    });
    if (stockRecord) {
      stockRecord.quantity += Number(quantity);
      await stockRecord.save();
    } else {
      await Stock.create({
        product: productId,
        color: color,
        quantity: Number(quantity),
      });
    }
  } catch (error) {
    console.error("Error updating or creating stock:", error);
  }
};

const getReceipts = asyncHandler(async (req, res) => {
  try {
    const queries = { ...req.query };
    const excludeFields = ["limit", "sort", "page", "fields", "q", "startDate", "endDate"];
    excludeFields.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );
    const formattedQueries = JSON.parse(queryString);

    // Add date filtering
    if (req.query.startDate || req.query.endDate) {
      formattedQueries.createdAt = {};
      if (req.query.startDate) {
        formattedQueries.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        formattedQueries.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    let queryCommand = PurchaseOrder.find(formattedQueries);

    if (req.query.q) {
      const searchRegex = new RegExp(req.query.q, "i"); // Case-insensitive regex
      queryCommand = queryCommand.populate({
        path: "supplier",
        match: {
          $or: [{ name: searchRegex }],
        },
        select: "name",
      });
    } else {
      queryCommand = queryCommand
        .populate("supplier", "name")
        .populate("products.product", "title")
    }

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

    const receipts = await queryCommand.exec();
    const filteredReceipts = receipts.filter(
      (receipts) => receipts.supplier !== null
    );
    const counts = await PurchaseOrder.countDocuments(formattedQueries);

    return res.status(200).json({
      success: true,
      // receipts: receipts,
      receipts: filteredReceipts,
      counts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  createPurchaseOrder,
  saveOrUpdateStock,
  getReceipts,
};
