const Order = require("../models/order");
const User = require("../models/user");
const { updateStockAfterOrder } = require('../controllers/stock');
const Product = require("../models/product");
const Stock = require("../models/stock");
const PurchaseOrder = require("../models/purchaseOrder");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const sendMail = require("../ultils/sendMail");
const { default: mongoose } = require("mongoose");





// const createOrder = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { products, total, address, status, paymentMethod, paymentStatus, couponCode } = req.body;

//   const user = await User.findById(_id);
//   const email = user.email;

//   if (!email) {
//     console.error("Email not found for user:", req.user);
//     return res.status(400).json({ success: false, message: "Email is required" });
//   }

//   if (!paymentMethod) {
//     return res.status(400).json({ success: false, message: "Payment method is required" });
//   }

//   if (address) {
//     await User.findByIdAndUpdate(_id, { address, cart: [] });
//   }

//   // Initialize the final total with the provided total
//   let finalTotal = total;

//   // Apply coupon if provided
//   if (couponCode) {
//     const coupon = await Coupon.findOne({ name: couponCode });

//     if (!coupon) {
//       return res.status(400).json({ success: false, message: "Invalid coupon code" });
//     }

//     if (coupon.expire < Date.now()) {
//       return res.status(400).json({ success: false, message: "Coupon has expired" });
//     }

//     // Calculate the discount
//     const discountAmount = (finalTotal * coupon.discount) / 100;
//     finalTotal -= discountAmount;
//   }

//   // Order data with final total after applying the coupon discount
//   const orderData = {
//     products,
//     total: finalTotal,  // Use finalTotal after applying discount
//     orderBy: _id,
//     status: status || "Awaiting Confirmation",
//     paymentMethod,
//     paymentStatus: paymentStatus || "Pending",
    
//   };

//   const order = await Order.create(orderData);
//   console.log("Created Order:", order);

//   if (order) {
//     try {
//       // Update stock after creating the order
//       await updateStockAfterOrder(products);
//     } catch (error) {
//       return res.status(400).json({ success: false, message: error.message });
//     }

//     const productsDetails = products
//       .map(
//         (item) => `
//         <div style="
//             font-family: Poppins, sans-serif;
//             border: 1px solid #ddd; 
//             border-radius: 5px; 
//             padding: 10px; 
//             margin-bottom: 10px; 
//             background-color: #fff;
//             display: flex; 
//             align-items: center;">
            
//             <img src="${item.image}" alt="${item.title}" style="
//                 width: 180px; 
//                 height: 180px; 
//                 border-radius: 5px; 
//                 margin-right: 15px;
//                 ">
      
//             <div style="flex-grow: 1;">
//                 <h3 style="
//                     margin: 0; 
//                     font-size: 18px; 
//                     color: #6D8777;">
//                     ${item.title}
//                 </h3>
//                 <p style="margin: 5px 0; color: #555;">
//                     Color: <strong>${item.color}</strong>
//                 </p>
//                 <p style="margin: 5px 0; color: #555;">
//                     Quantity: <strong>${item.quantity}</strong>
//                 </p>
//                 <p style="margin: 5px 0; color: #555;">
//                     Price: <strong>${item.price} VNĐ</strong>
//                 </p>
//             </div>
//         </div>
//       `
//       )
//       .join("");

//     const html = `
//   <div style="
//         font-family: Poppins, sans-serif;
//         max-width: 600px;
//         padding: 10px; 
//         border-radius: 10px; 
//         background-color: #f1f1f1;
//   ">
//       <h2 style="
//           text-align: center; 
//           font-size: 40px;
//           color: #333;
//           margin-bottom: 5px;
//           color: #6D8777;
//           font-weight: bold;
//       ">ORDER CONFIRMATION</h2>
      
//       <p style="
//           font-size: 16px; 
//           color: #555;
//           margin-bottom: 10px;
//       ">Thank you for your purchase!</p>
//       <p style="
//           font-size: 18px; 
//           color: #444;
//           font-weight: bold; 
//           margin-bottom: 10px;
//       "><strong>Order Details:</strong></p>
//       <p style="
//           font-size: 16px; 
//           color: #555; 
//           margin-bottom: 5px;
//       ">Order ID: <span style="color: #000; font-weight: bold;">${order._id}</span></p>
//       <p style="
//           font-size: 16px; 
//           color: #555; 
//           margin-bottom: 5px;
//       ">Total: <span style="color: #000; font-weight: bold;">${finalTotal} VNĐ</span></p>
//       <p style="
//           font-size: 16px; 
//           color: #555; 
//           margin-bottom: 5px;
//       ">Payment Method: <span style="color: #000; font-weight: bold;">${paymentMethod}</span></p>
//       <p style="
//           font-size: 16px; 
//           color: #555; 
//           margin-bottom: 5px;
//       ">Status: <span style="color: #000; font-weight: bold;">${status || "Processing"}</span></p>
      
//       <h3 style="
//           margin-top: 20px; 
//           font-size: 20px; 
//           color: #444;">
//       </h3>
//       ${productsDetails}
//   </div>
// `;

//     try {
//       await sendMail({
//         email,
//         subject: "Order Confirmation",
//         text: "Your order has been placed successfully.",
//         html,
//       });
//     } catch (emailError) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to send confirmation email.",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Please check your email.",
//     });
//   } else {
//     return res.status(400).json({ success: false, message: "Order creation failed" });
//   }
// });

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { products, total, address, status, paymentMethod, paymentStatus, couponCode } = req.body;

  const user = await User.findById(_id);
  const email = user.email;

  if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
  }

  if (!paymentMethod) {
      return res.status(400).json({ success: false, message: "Payment method is required" });
  }

  if (address) {
      await User.findByIdAndUpdate(_id, { address, cart: [] });
  }

  let finalTotal = total;
  let coupon = null;

  // Apply coupon if provided
  if (couponCode) {
    coupon = await Coupon.findOne({ name: couponCode });

    if (!coupon) {
        return res.status(400).json({ success: false, message: "Invalid coupon code" });
    }

    if (coupon.expire < Date.now()) {
        return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    // if (coupon.usedBy.includes(_id)) {
    //     return res.status(400).json({ success: false, message: "Coupon has already been used" });
    // }

    if (coupon.usedBy.length >= coupon.usageLimit) {
        return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }

    // Calculate discount and update final total
    const discountAmount = (finalTotal * coupon.discount) / 100;
    finalTotal -= discountAmount;
}

  const orderData = {
      products,
      total: finalTotal,
      orderBy: _id,
      status: status || "Awaiting Confirmation",
      paymentMethod,
      paymentStatus: paymentStatus || "Pending",
      // coupon: coupon ? coupon._id : null,
  };

  const order = await Order.create(orderData);

  if (order) {
      try {
          // Update stock after creating the order
          await updateStockAfterOrder(products);
          
          
      } catch (error) {
          return res.status(400).json({ success: false, message: error.message });
      }

          const productsDetails = products
      .map(
        (item) => `
        <div style="
            font-family: Poppins, sans-serif;
            border: 1px solid #ddd; 
            border-radius: 10px; 
            padding: 10px; 
            margin-bottom: 10px; 
            background-color: #fff;
            display: flex; 
            align-items: center;">
            
            <img src="${item.image}" alt="${item.title}" style="
                width: 180px; 
                height: 180px; 
                border-radius: 5px; 
                margin-right: 15px;
                ">
      
            <div style="flex-grow: 1;">
                <h3 style="
                    margin: 0; 
                    font-size: 18px; 
                    color: #6D8777;">
                    ${item.title}
                </h3>
                <p style="margin: 5px 0; color: #555;">
                    Color: <strong>${item.color}</strong>
                </p>
                <p style="margin: 5px 0; color: #555;">
                    Quantity: <strong>${item.quantity}</strong>
                </p>
                <p style="margin: 5px 0; color: #555;">
                    Price: <strong>${item.price} VNĐ</strong>
                </p>
            </div>
        </div>
      `
      )
      .join("");

    const html = `
  <div style="
        font-family: Poppins, sans-serif;
        max-width: 600px;
        padding: 10px; 
        border-radius: 10px; 
        background-color: #f1f1f1;
  ">
      <h2 style="
          text-align: center; 
          font-size: 40px;
          color: #333;
          margin-bottom: 5px;
          color: #6D8777;
          font-weight: bold;
      ">ORDER CONFIRMATION</h2>
      
      <p style="
          font-size: 16px; 
          color: #555;
          margin-bottom: 10px;
      ">Thank you for your purchase!</p>
      <p style="
          font-size: 18px; 
          color: #444;
          font-weight: bold; 
          margin-bottom: 10px;
      "><strong>Order Details:</strong></p>
      <p style="
          font-size: 16px; 
          color: #555; 
          margin-bottom: 5px;
      ">Order ID: <span style="color: #000; font-weight: bold;">${order._id}</span></p>
      <p style="
          font-size: 16px; 
          color: #555; 
          margin-bottom: 5px;
      ">Total: <span style="color: #000; font-weight: bold;">${finalTotal} VNĐ</span></p>
      <p style="
          font-size: 16px; 
          color: #555; 
          margin-bottom: 5px;
      ">Payment Method: <span style="color: #000; font-weight: bold;">${paymentMethod}</span></p>
      <p style="
          font-size: 16px; 
          color: #555; 
          margin-bottom: 5px;
      ">Status: <span style="color: #000; font-weight: bold;">${status || "Processing"}</span></p>
      
      <h3 style="
          margin-top: 20px; 
          font-size: 20px; 
          color: #444;">
      </h3>
      ${productsDetails}
  </div>
`;

      try {
          await sendMail({
              email,
              subject: "Order Confirmation",
              text: "Your order has been placed successfully.",
              html,
          });
      } catch (emailError) {
          return res.status(500).json({ success: false, message: "Failed to send confirmation email." });
      }

      return res.json({ success: true, message: "Please check your email." });
  } else {
      return res.status(400).json({ success: false, message: "Order creation failed" });
  }
});




// const updateStatus = asyncHandler(async (req, res) => {
//   const { oid } = req.params;
//   const { status, paymentStatus } = req.body;

//   if (!status && !paymentStatus) {
//     throw new Error("Missing status or payment status");
//   }

//   const updateData = {};
//   if (status) {
//     updateData.status = status;

    
//     if (status === "Delivered") {
//       updateData.deliveryDate = new Date();
//       // updateData.paymentStatus = "Paid";
//     }
//   }

//   if (paymentStatus) updateData.paymentStatus = paymentStatus;

//   const response = await Order.findByIdAndUpdate(oid, updateData, { new: true });

//   return res.status(200).json({
//     success: response ? true : false,
//     response: response ? response : "Something went wrong",
//   });
// });

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status, paymentStatus } = req.body;

  // Kiểm tra xem trạng thái hoặc trạng thái thanh toán có được cung cấp không
  if (!status && !paymentStatus) {
    throw new Error("Missing status or payment status");
  }

  const updateData = {};
  const statusHistoryEntry = {}; // Lưu lịch sử trạng thái mới (nếu có)

  if (status) {
    updateData.status = status;

    // Nếu trạng thái là "Delivered", cập nhật ngày giao hàng
    if (status === "Delivered") {
      updateData.deliveryDate = new Date();
    }

    // Thêm vào lịch sử trạng thái
    statusHistoryEntry.status = status;
    statusHistoryEntry.updatedAt = new Date();
  }

  if (paymentStatus) {
    updateData.paymentStatus = paymentStatus;
  }

  // Tìm đơn hàng và cập nhật
  const order = await Order.findById(oid);
  if (!order) {
    throw new Error("Order not found");
  }

  // Cập nhật lịch sử trạng thái nếu có thay đổi trạng thái
  if (status) {
    order.statusHistory.push(statusHistoryEntry);
  }

  // Cập nhật các trường khác
  Object.assign(order, updateData);

  // Lưu thay đổi
  const response = await order.save();

  return res.status(200).json({
    success: true,
    response,
  });
});


const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { paymentStatus } = req.body;
  if (!paymentStatus) throw new Error("Missing status");
  const response = await Order.findByIdAndUpdate(
    oid,
    { paymentStatus },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "Something went wrong",
  });
});




const cancelOrder = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const userId = req.user._id;

  try {
      const order = await Order.findById(oid).populate('products.product');

      if (!order) {
          return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
      }

      if (!order.orderBy.equals(userId)) {
          return res.status(403).json({ success: false, message: 'Bạn không có quyền hủy đơn hàng này' });
      }

      if (order.status !== 'Awaiting Confirmation') {
          return res.status(400).json({ success: false, message: 'Không thể hủy đơn hàng này' });
      }

      // Update product quantity and stock
      await Promise.all(
          order.products.map(async (item) => {
              // Update the main product quantity
              await Product.findByIdAndUpdate(item.product._id, {
                  $inc: { quantity: item.quantity,
                    sold: -item.quantity
                   },

              });

              // Find and update the stock based on product and color (if applicable)
              await Stock.findOneAndUpdate(
                  { product: item.product._id, color: item.color },
                  { $inc: { quantity: item.quantity } }
              );
          })
      );

      // Change order status to 'Cancelled'
      order.status = 'Cancelled';
      order.statusHistory.push({
        status: 'Cancelled',
        updatedAt: new Date(), // Record the cancellation time
    });
      await order.save();

      res.json({ success: true, message: 'Đơn hàng đã được hủy thành công', order });

  } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});


const getOrderbyUser = asyncHandler(async (req, res) => {
  try {
    const queries = { ...req.query };
    const { _id } = req.user; // Logged-in user ID
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    // Advanced Filtering (price, etc.)
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );
    const formattedQueries = JSON.parse(queryString);

    // Merge with logged-in user's _id for filtering
    const finalQuery = {
      ...formattedQueries,
      orderBy: _id, // Ensure only this user's orders are fetched
    };

    if (queries.status) {
      finalQuery.status = queries.status;
    }


    // Building the query (use finalQuery instead of formattedQueries)
    let queryCommand = Order.find(finalQuery);

    queryCommand = queryCommand.populate(
      "orderBy",
      "firstname lastname mobile address"
    );

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
    const orders = await queryCommand.exec();
    const counts = await Order.countDocuments(finalQuery);

    // Response
    return res.status(200).json({
      success: true,
      orders: orders.map((order) => ({
        ...order._doc,
        paymentMethod: order.paymentMethod, // Include payment method
      })),
      counts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// const getOrderbyAdmin = asyncHandler(async (req, res) => {
//   try {
//     const queries = { ...req.query };
//     const { _id } = req.user; // Get the admin user's ID
//     const excludeFields = ["limit", "sort", "page", "fields"];
//     excludeFields.forEach((el) => delete queries[el]);

//     // Advanced Filtering (optional)
//     let queryString = JSON.stringify(queries);
//     queryString = queryString.replace(
//       /\b(gte|gt|lt|lte)\b/g,
//       (match) => `$${match}`
//     );
//     const formattedQueries = JSON.parse(queryString);

//     // Building the query for all orders
//     let queryCommand = Order.find(formattedQueries);

//     queryCommand = queryCommand.populate(
//       "orderBy",
//       "firstname lastname mobile"
//     );

//     if (queries.q) {
//       queryCommand = queryCommand.find({
//         $or: [
//           { "orderBy.firstname": { $regex: queries.q, $options: "i" } },
//           { "orderBy.lastname": { $regex: queries.q, $options: "i" } },
//           { "orderBy.mobile": { $regex: queries.q, $options: "i" } },
//         ],
//       });
//     }

//     // Sorting
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(",").join(" ");
//       queryCommand = queryCommand.sort(sortBy);
//     } else {
//       queryCommand = queryCommand.sort("-createdAt"); // Default sort by createdAt
//     }

//     // Field Limiting
//     if (req.query.fields) {
//       const fields = req.query.fields.split(",").join(" ");
//       queryCommand = queryCommand.select(fields);
//     } else {
//       queryCommand = queryCommand.select("-__v"); // Exclude __v field by default
//     }

//     // Pagination
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10);
//     const skip = (page - 1) * limit;
//     queryCommand = queryCommand.skip(skip).limit(limit);

//     // Execute the query
//     const orders = await queryCommand.exec();
//     const counts = await Order.countDocuments(formattedQueries); // Get total count of orders

//     // Response
//     return res.status(200).json({
//       success: true,
//       orders: orders,
//       counts,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

const getOrderbyAdmin = asyncHandler(async (req, res) => {
  try {
    const queries = { ...req.query };
    const excludeFields = ["limit", "sort", "page", "fields", "q"];
    excludeFields.forEach((el) => delete queries[el]);

    // Advanced Filtering (optional)
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );
    const formattedQueries = JSON.parse(queryString);

    // Build the query for orders
    let queryCommand = Order.find(formattedQueries);

    // Apply search filter for "q"
    if (req.query.q) {
      const searchRegex = new RegExp(req.query.q, "i"); // Case-insensitive regex
      queryCommand = queryCommand.populate({
        path: "orderBy",
        match: {
          $or: [
            { firstname: searchRegex },
            { lastname: searchRegex },
            { mobile: searchRegex },
          ],
        },
        select: "firstname lastname mobile",
      });
    } else {
      queryCommand = queryCommand.populate("orderBy", "firstname lastname mobile");
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    } else {
      queryCommand = queryCommand.sort("-createdAt"); // Default sort by createdAt
    }

    // Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommand = queryCommand.select(fields);
    } else {
      queryCommand = queryCommand.select("-__v"); // Exclude __v field by default
    }

         // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10);
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    // Execute the query
    const orders = await queryCommand.exec();

    // Filter out orders where `orderBy` is `null` due to unmatched populate
    const filteredOrders = orders.filter((order) => order.orderBy !== null);

    const counts = await Order.countDocuments(formattedQueries); // Get total count of orders

    // Response
    return res.status(200).json({
      success: true,
      orders: filteredOrders,
      counts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


const getOrdersToday = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const ordersToday = await Order.find({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });

  const totalRevenue = ordersToday.reduce((acc, order) => acc + order.total, 0);

  const totalProductsSold = ordersToday.reduce((acc, order) => {
    const orderQuantity = order.products.reduce((sum, product) => sum + product.quantity, 0);
    return acc + orderQuantity;
  }, 0);

  return res.json({
    success: true,
    orders: ordersToday,
    counts: ordersToday.length,
    totalRevenue,
    totalProductsSold,
  });
});


const getOrderDetail = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const order = await Order.findById(oid)
  return res.status(200).json({
    success: order ? true : false,
    orderData: order ? order : "Cannot get product",
  });
});



const calculateProfit = asyncHandler(async (req, res) => {
    try {
        // Tính tổng doanh thu từ các đơn hàng của khách hàng
        const deliveredOrders = await Order.aggregate([
            // {
            //     $match: {
            //         status: { $in: ['Delivered', 'Success'] } // Chỉ chọn các đơn hàng đã giao hoặc thành công
            //     }
            // },
            {
              $match: {
                status: { $ne: "Cancelled" } // Only include orders where status is not 'cancelled'
              }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' } // Tính tổng doanh thu
                }
            }
        ]);
        const totalRevenue = deliveredOrders[0]?.totalRevenue || 0; // Lấy giá trị hoặc 0 nếu không có đơn hàng nào

        // Tính tổng chi phí từ đơn nhập hàng
        const purchaseOrders = await PurchaseOrder.aggregate([
            {
                $group: {
                    _id: null,
                    totalCost: { $sum: '$totalAmount' } // Tính tổng chi phí từ đơn nhập hàng
                }
            }
        ]);
        const totalCost = purchaseOrders[0]?.totalCost || 0; // Lấy giá trị hoặc 0 nếu không có đơn nhập hàng nào

        // Tính lợi nhuận bằng doanh thu - chi phí
        const profit = totalRevenue - totalCost;

        // Gửi kết quả về phía client dưới dạng JSON
        res.status(200).json({
            success: true,
            totalRevenue,
            totalCost,
            profit,
        });
    } catch (error) {
        console.error('Lỗi khi tính lợi nhuận:', error);
        // Gửi lỗi về phía client
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tính lợi nhuận',
        });
    }
});

const calculateDailyProfit = asyncHandler(async (req, res) => {
  try {
      const dailyProfit = await Order.aggregate([
          // {
          //     $match: {
          //         status: { $in: ['Delivered', 'Success'] }
          //     }
          // },
          {
            $match: {
              status: { $ne: "Cancelled" } // Only include orders where status is not 'cancelled'
            }
          },
          {
              $group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  totalRevenue: { $sum: '$total' }
              }
          },
          
          {
              $project: {
                  _id: 1,
                  totalRevenue: 1,
                  
              }
          }
      ]);

      res.status(200).json({
          success: true,
          dailyProfit
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Lỗi khi tính lợi nhuận theo ngày',
      });
  }
});


const calculateWeeklyProfit = asyncHandler(async (req, res) => {
  try {
      const weeklyProfit = await Order.aggregate([
          {
              $match: {
                  status: { $in: ['Delivered', 'Success'] }
              }
          },
          {
              $group: {
                  _id: { week: { $week: "$createdAt" }, year: { $year: "$createdAt" } },
                  totalRevenue: { $sum: '$total' }
              }
          },
          {
              $lookup: {
                  from: 'purchaseorders',
                  pipeline: [
                      {
                          $group: {
                              _id: { week: { $week: "$createdAt" }, year: { $year: "$createdAt" } },
                              totalCost: { $sum: '$totalAmount' }
                          }
                      }
                  ],
                  as: 'purchaseOrders'
              }
          },
          {
              $project: {
                  _id: 1,
                  totalRevenue: 1,
                  totalCost: { $ifNull: [{ $arrayElemAt: ['$purchaseOrders.totalCost', 0] }, 0] },
                  profit: { $subtract: ['$totalRevenue', { $ifNull: [{ $arrayElemAt: ['$purchaseOrders.totalCost', 0] }, 0] }] }
              }
          }
      ]);

      res.status(200).json({
          success: true,
          weeklyProfit
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Lỗi khi tính lợi nhuận theo tuần',
      });
  }
});

const calculateMonthlyProfit = asyncHandler(async (req, res) => {
  try {
    const monthlyProfit = await Order.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" } // Only include orders where status is not 'cancelled'
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalRevenue: { $sum: '$total' }
        }
      },
      {
        $lookup: {
          from: 'purchaseorders',
          let: { month: '$_id.month', year: '$_id.year' }, // Truyền tháng và năm vào biến
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $month: "$createdAt" }, '$$month'] }, // So sánh tháng
                    { $eq: [{ $year: "$createdAt" }, '$$year'] }  // So sánh năm
                  ]
                }
              }
            },
            {
              $group: {
                _id: null, // Nhóm lại tất cả để lấy tổng
                totalCost: { $sum: '$totalAmount' } // Tính tổng chi phí
              }
            }
          ],
          as: 'purchaseOrders'
        }
      },
      {
        $project: {
          _id: 1,
          totalRevenue: 1,
          totalCost: { $ifNull: [{ $arrayElemAt: ['$purchaseOrders.totalCost', 0] }, 0] },
          profit: { $subtract: ['$totalRevenue', { $ifNull: [{ $arrayElemAt: ['$purchaseOrders.totalCost', 0] }, 0] }] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      monthlyProfit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tính lợi nhuận theo tháng',
    });
  }
});

const calculateYearlyProfit = asyncHandler(async (req, res) => {
  try {
      const yearlyProfit = await Order.aggregate([
          {
              $match: {
                  status: { $in: ['Delivered', 'Success'] }
              }
          },
          {
              $group: {
                  _id: { $year: "$createdAt" },
                  totalRevenue: { $sum: '$total' }
              }
          },
          {
              $lookup: {
                  from: 'purchaseorders',
                  pipeline: [
                      {
                          $group: {
                              _id: { $year: "$createdAt" },
                              totalCost: { $sum: '$totalAmount' }
                          }
                      }
                  ],
                  as: 'purchaseOrders'
              }
          },
          {
              $project: {
                  _id: 1,
                  totalRevenue: 1,
                  totalCost: { $ifNull: [{ $arrayElemAt: ['$purchaseOrders.totalCost', 0] }, 0] },
                  profit: { $subtract: ['$totalRevenue', { $ifNull: [{ $arrayElemAt: ['$purchaseOrders.totalCost', 0] }, 0] }] }
              }
          }
      ]);

      res.status(200).json({
          success: true,
          yearlyProfit
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Lỗi khi tính lợi nhuận theo năm',
      });
  }
});



module.exports = {
  createOrder,
  updateStatus,
  cancelOrder,
  getOrderbyUser,
  getOrderbyAdmin,
  updatePaymentStatus,
  getOrderDetail,
  getOrdersToday,
  calculateProfit,
  calculateDailyProfit,
  calculateWeeklyProfit,
  calculateMonthlyProfit,
  calculateYearlyProfit
};
