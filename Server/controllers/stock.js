const asyncHandler = require('express-async-handler')
const Stock = require('../models/stock.js');
const Product = require("../models/product");
const Order = require("../models/order");

const updateStockAfterOrder = asyncHandler(async (orderItems) => {
  await Promise.all(
    orderItems.map(async (item) => {
      const stockItem = await Stock.findOne({
        product: item.product,
        color: item.color,
      });

      if (!stockItem) {
        throw new Error(`Stock not found for product ID: ${item.product} and color: ${item.color}`);
      }

      if (stockItem.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ID: ${item.product} and color: ${item.color}`);
      }

      stockItem.quantity -= item.quantity;

     
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found for ID: ${item.product}`);
      }

      
      product.sold += item.quantity;

      
      await stockItem.save(); 
      await product.save();    
    })
  );
});



const getStock = asyncHandler(async (req, res) => {
  const response = await Stock.find()
    .populate('product', 'title quantity category brand images')
    .select('quantity color');

  const counts = response.length;

  // Sum up the total quantity from all stock entries
  const totalQuantity = response.reduce((acc, stock) => acc + stock.quantity, 0);

  return res.json({
    success: response ? true : false,
    totalQuantity, 
    counts,
    Stock: response ? response : 'Cannot Get Stock!'
  });
});

const deleteStockById = asyncHandler(async (req, res) => {
  const { stockId } = req.params;

  try {
    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    await Stock.findByIdAndDelete(stockId);

    return res.status(200).json({
      success: true,
      message: 'Stock deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



module.exports = {
  updateStockAfterOrder,
  getStock,
  deleteStockById
};
