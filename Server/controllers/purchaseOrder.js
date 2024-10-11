// const PurchaseOrder = require("../models/purchaseOrder.js");
// const Product = require("../models/product");
// const Supplier = require("../models/supplier");
// const Stock = require("../models/stock.js");
// const asyncHandler = require("express-async-handler");

// const createPurchaseOrder = asyncHandler(async (req, res) => {
//   const { supplier, products } = req.body;
//   if (!supplier || !products || products.length === 0) {
//     return res.status(400).json({ success: false, message: "Missing input" });
//   }

//   let totalAmount = 0;

//   await Promise.all(
//     products.map(async (item) => {
//       const product = await Product.findById(item.product);
//       const variant = product.variant.find((v) => v.color === item.color);

//       if (variant) {
//         variant.quantity += item.quantity;
//       }

//       product.quantity += item.quantity;

//       await product.save();

//       totalAmount += item.quantity * item.price;
//     })
//   );
//   const newPurchaseOrder = new PurchaseOrder({
//     supplier,
//     products,
//     totalAmount,
//   });
//   const savedOrder = await newPurchaseOrder.save();

//   const populatedOrder = await PurchaseOrder.findById(savedOrder._id)
//   .populate('supplier', 'name') 
//   .populate('products.product', 'title'); 

//   return res.status(201).json({
//     success: true,
//     message: "Purchase order created successfully",
//     purchaseOrder: populatedOrder,
//   });
// });

// module.exports = {
//   createPurchaseOrder,
// };


// const PurchaseOrder = require("../models/purchaseOrder.js");
// const Product = require('../models/product');
// const Stock = require('../models/stock.js');
// const asyncHandler = require('express-async-handler');

// const createPurchaseOrder = asyncHandler(async (req, res) => {
//     console.log('createPurchaseOrder called');
//   const { supplier, products } = req.body;

//   if (!supplier || !products || products.length === 0) {
//     return res.status(400).json({ success: false, message: 'Missing input' });
//   }

//   let totalAmount = 0;

//   await Promise.all(
//     products.map(async (item) => {
//     const product = await Product.findById(item.product);
//     console.log('Product variants:', product.variant); // Log available variants

//     const variant = product.variant.find((v) => v.color.toLowerCase() === item.color.toLowerCase());
    
//     if (!product) {
//       console.log('Product not found:', item.product);
//     } else if (!variant) {
//       console.log('Variant not found for color:', item.color);
//     } else {
//       console.log('Current variant quantity:', variant.quantity); 
//       variant.quantity = (variant.quantity || 0) + Number(item.quantity);
//       product.quantity = product.variant.reduce((total, v) => total + (v.quantity || 0), 0);
      
//       await product.save();
//     }

//       product.quantity += item.quantity;

//       await product.save();

//       totalAmount += item.quantity * item.price;

//       const stockRecord = await Stock.findOne({ product: item.product, color: item.color });
//       if (stockRecord) {
//         stockRecord.quantity += item.quantity;
//         await stockRecord.save();
//       } else {
//         await Stock.create({
//           product: item.product,
//           color: item.color,
//           quantity: item.quantity
//         });
//       }
//     })
//   );

//   const newPurchaseOrder = new PurchaseOrder({
//     supplier,
//     products,
//     totalAmount, 
//   });

//   // Lưu đơn nhập hàng vào cơ sở dữ liệu
//   const savedOrder = await newPurchaseOrder.save();

//   // Populate thông tin nhà cung cấp và tên sản phẩm sau khi lưu đơn hàng
//   const populatedOrder = await PurchaseOrder.findById(savedOrder._id)
//     .populate('supplier', 'name') // Hiển thị tên nhà cung cấp
//     .populate('products.product', 'title'); // Hiển thị tên sản phẩm

//   return res.status(201).json({
//     success: true,
//     message: 'Purchase order created successfully',
//     purchaseOrder: populatedOrder,
//   });
// });

const PurchaseOrder = require("../models/purchaseOrder.js");
const Product = require('../models/product');
const Stock = require('../models/stock.js');
const asyncHandler = require('express-async-handler');

const createPurchaseOrder = asyncHandler(async (req, res) => {
    console.log('createPurchaseOrder called');
    const { supplier, products } = req.body;

    if (!supplier || !products || products.length === 0) {
        return res.status(400).json({ success: false, message: 'Missing input' });
    }

    let totalAmount = 0;
    const processedProducts = []; 
    const errors = []; 

    // await Promise.all(
    //     products.map(async (item) => {
    //         const product = await Product.findById(item.product).populate('variant');

    //         if (!product) {
    //             errors.push(`Product not found: ${item.product}`);
    //             return; 
    //         }

    //         let variant = null;

    //         if (product.variant && product.variant.length > 0) {
    //             variant = product.variant.find((v) => v.color.toLowerCase() === item.color.toLowerCase());

    //             if (variant) {
    //                 variant.quantity = (variant.quantity || 0) + Number(item.quantity);
    //                 totalAmount += item.quantity * variant.price;

    //                 await product.save();

    //                 await saveOrUpdateStock(item.product, variant.color, item.quantity);

    //                 processedProducts.push({
    //                     product: product._id,
    //                     color: variant.color,
    //                     quantity: item.quantity,
    //                     price: variant.price,
    //                 });

    //                 return; 
    //             }
    //         }

    //         if (product.color.toLowerCase() === item.color.toLowerCase()) {
    //             product.quantity = (product.quantity || 0) + Number(item.quantity);
    //             totalAmount += item.quantity * product.price;

    //             await product.save();

    //             await saveOrUpdateStock(item.product, product.color, item.quantity);

    //             processedProducts.push({
    //                 product: product._id,
    //                 color: product.color,
    //                 quantity: item.quantity,
    //                 price: product.price,
    //             });
    //         } else {
    //             errors.push(`No matching color for product: ${product.title}, color: ${item.color}`);
    //         }
    //     })
    // );

    await Promise.all(
      products.map(async (item) => {
          const product = await Product.findById(item.product).populate('variant');
  
          if (!product) {
              errors.push(`Product not found: ${item.product}`);
              return; 
          }
  
          let variant = null;
          let price = Number(item.price); // Use the price from the request if available
  
          if (product.variant && product.variant.length > 0) {
              variant = product.variant.find((v) => v.color.toLowerCase() === item.color.toLowerCase());
  
              if (variant) {
                  variant.quantity = (variant.quantity || 0) + Number(item.quantity);
                  price = price || variant.price; // Fallback to variant price if no price is provided
  
                  totalAmount += item.quantity * price;
  
                  await product.save();
  
                  await saveOrUpdateStock(item.product, variant.color, item.quantity);
  
                  processedProducts.push({
                      product: product._id,
                      color: variant.color,
                      quantity: item.quantity,
                      price, // Save the price used
                  });
  
                  return; 
              }
          }
  
          if (product.color.toLowerCase() === item.color.toLowerCase()) {
              product.quantity = (product.quantity || 0) + Number(item.quantity);
              price = price || product.price; // Fallback to product price if no price is provided
  
              totalAmount += item.quantity * price;
  
              await product.save();
  
              await saveOrUpdateStock(item.product, product.color, item.quantity);
  
              processedProducts.push({
                  product: product._id,
                  color: product.color,
                  quantity: item.quantity,
                  price, // Save the price used
              });
          } else {
              errors.push(`No matching color for product: ${product.title}, color: ${item.color}`);
          }
      })
  );
  

    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: 'Some products failed', errors });
    }

    const newPurchaseOrder = new PurchaseOrder({
        supplier,
        products: processedProducts,
        totalAmount,
    });

    const savedOrder = await newPurchaseOrder.save();

    const populatedOrder = await PurchaseOrder.findById(savedOrder._id)
        .populate('supplier', 'name')
        .populate('products.product', 'title');

    return res.status(201).json({
        success: true,
        message: 'Purchase order created successfully',
        purchaseOrder: populatedOrder,
    });
});

const saveOrUpdateStock = async (productId, color, quantity) => {
    try {
        const stockRecord = await Stock.findOne({ product: productId, color: color });
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
        console.error('Error updating or creating stock:', error);
    }
};

const getReceipts = asyncHandler(async (req, res) => {
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
    //   if (queries?.name)
    //     formattedQueries.name = { $regex: queries.name, $options: "i" };
  
    //   if (req.query.q) {
    //     delete formattedQueries.q;
    //     formattedQueries["$or"] = [
    //       { name: { $regex: req.query.q, $options: "i" } },
    //       { email: { $regex: req.query.q, $options: "i" } },
    //       { address: { $regex: req.query.q, $options: "i" } },
    //       { contact: { $regex: req.query.q, $options: "i" } },
    //     ];
    //   }
  
      let queryCommand = PurchaseOrder.find(formattedQueries)
        .populate("supplier", "name")
        .populate('products.product', 'title');
  
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
      const counts = await PurchaseOrder.countDocuments(formattedQueries);
  
      return res.status(200).json({
        success: true,
        receipts: receipts,
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
  getReceipts
};
