const Order = require("../models/order");
const User = require("../models/user");
const { updateStockAfterOrder } = require('../controllers/stock');
const Product = require("../models/product");
const Stock = require("../models/stock");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const sendMail = require("../ultils/sendMail");
const { default: mongoose } = require("mongoose");

// const createOrder = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { products, total, address, status, paymentMethod, paymentStatus } = req.body;

//   if (!paymentMethod) {
//       return res.status(400).json({ success: false, message: 'Payment method is required' });
//   }

//   if (address) {
//       await User.findByIdAndUpdate(_id, { address, cart: [] });
//   }

//   const data = { products, total, orderBy: _id, status, paymentMethod, paymentStatus };
//   if (status) data.status = status;

//   const rs = await Order.create(data);

//   if (rs) {
//       // Cập nhật quantity và sold cho từng sản phẩm trong đơn hàng
//       await Promise.all(products.map(async (item) => {
//           await Product.findByIdAndUpdate(item.product, {
//               $inc: {
//                   quantity: -item.quantity,
//                   sold: +item.quantity
//               }
//           });
//       }));
//   }

//   return res.status(200).json({
//       success: rs ? true : false,
//       rs: rs ? rs : 'Something went wrong',
//   });
// });

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { products, total, address, status, paymentMethod, paymentStatus } =
    req.body;

  const user = await User.findById(_id);
  const email = user.email;

  if (!email) {
    console.error("Email not found for user:", req.user);
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  if (!paymentMethod) {
    return res
      .status(400)
      .json({ success: false, message: "Payment method is required" });
  }

  if (address) {
    await User.findByIdAndUpdate(_id, { address, cart: [] });
  }

  // Dữ liệu đơn hàng
  const orderData = {
    products,
    total,
    orderBy: _id,
    status: status || "Awaiting Confirmation",
    paymentMethod,
    paymentStatus: paymentStatus || "Pending",
  };

  const order = await Order.create(orderData);
  console.log("Created Order:", order);

  if (order) {
    // await Promise.all(
    //   products.map(async (item) => {
    //     // await Product.findByIdAndUpdate(item.product, {
    //     //   $inc: {
    //     //     quantity: -item.quantity,
    //     //     sold: +item.quantity,
    //     //   },
    //     // });
    //     const product = await Product.findById(item.product);
    //     const variant = product.variant.find(v => v.color === item.color);

    //       if (variant) {
    //         // Cập nhật số lượng và sold của variant
    //         variant.quantity -= item.quantity;
    //         variant.sold += item.quantity;
    //       }

    //       // Cập nhật số lượng và sold của sản phẩm gốc
    //       product.quantity -= item.quantity;
    //       product.sold += item.quantity;

    //       await product.save();
    //   })
    // );

    try {
      // Cập nhật kho sau khi tạo đơn hàng
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
            border-radius: 5px; 
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
      ">Order ID: <span style="color: #000; font-weight: bold;">${
        order._id
      }</span></p>
      <p style="
          font-size: 16px; 
          color: #555; 
          margin-bottom: 5px;
      ">Total: <span style="color: #000; font-weight: bold;">${total} VNĐ</span></p>
      <p style="
          font-size: 16px; 
          color: #555; 
          margin-bottom: 5px;
      ">Payment Method: <span style="color: #000; font-weight: bold;">${paymentMethod}</span></p>
      <p style="
          font-size: 16px; 
          color: #555; 
          margin-bottom: 5px;
      ">Status: <span style="color: #000; font-weight: bold;">${
        status || "Processing"
      }</span></p>
      
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
      return res.status(500).json({
        success: false,
        message: "Failed to send confirmation email.",
      });
    }

    return res.json({
      success: true,
      message: "Please check your email.",
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Order creation failed" });
  }
});

// const createOrder = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { products, total, address, status, paymentMethod, paymentStatus } = req.body;

//   const user = await User.findById(_id);
//   const email = user.email;

//   if (!email) {
//     console.error("Email not found for user:", req.user);
//     return res
//       .status(400)
//       .json({ success: false, message: "Email is required" });
//   }

//   if (!paymentMethod) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Payment method is required" });
//   }

//   // let discountAmount = 0;

//   // if (couponCode) {
//   //   const coupon = await Coupon.findOne({ name: couponCode });
//   //   if (!coupon) {
//   //     return res
//   //       .status(400)
//   //       .json({ success: false, message: "Invalid coupon code" });
//   //   }

//   //   if (new Date() > coupon.expire) {
//   //     return res
//   //       .status(400)
//   //       .json({ success: false, message: "Coupon has expired" });
//   //   }

//   //   discountAmount = (total * coupon.discount) / 100;
//   // }

  
//   const finalTotal = total - discountAmount;

//   if (address) {
//     await User.findByIdAndUpdate(_id, { address, cart: [] });
//   }

//   // Dữ liệu đơn hàng
//   const orderData = {
//     products,
//     total, 
//     orderBy: _id,
//     status: status || "Processing",
//     paymentMethod,
//     paymentStatus: paymentStatus || "Pending",
//     // coupon: couponCode || null, 
//     // discount: discountAmount,  
//   };

//   const order = await Order.create(orderData);
//   console.log("Created Order:", order);

//   if (order) {
//     await Promise.all(
//       products.map(async (item) => {
//         const product = await Product.findById(item.product);
//         const variant = product.variant.find(v => v.color === item.color);

//         if (variant) {
//           variant.quantity -= item.quantity;
//           variant.sold += item.quantity;
//         }

//         product.quantity -= item.quantity;
//         product.sold += item.quantity;

//         await product.save();
//       })
//     );

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
//       <p style="
//           font-size: 16px; 
//           color: #555; 
//           margin-bottom: 5px;
//       ">Coupon: <span style="color: #000; font-weight: bold;">${couponCode || "N/A"}</span></p>
//       <p style="
//           font-size: 16px; 
//           color: #555; 
//           margin-bottom: 5px;
//       ">Discount: <span style="color: #000; font-weight: bold;">${discountAmount} VNĐ</span></p>
      
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
//     return res
//       .status(400)
//       .json({ success: false, message: "Order creation failed" });
//   }
// });


// const updateStatus = asyncHandler(async (req, res) => {
//   const { oid } = req.params;
//   const { status } = req.body;
//   if (!status) throw new Error("Missing status");
//   const response = await Order.findByIdAndUpdate(
//     oid,
//     { status },
//     { new: true }
//   );

//   return res.status(200).json({
//     success: response ? true : false,
//     response: response ? response : "Something went wrong",
//   });
// });

// const updateStatus = asyncHandler(async (req, res) => {
//   const { oid } = req.params;
//   const { status, paymentStatus } = req.body;

//   if (!status && !paymentStatus) {
//     throw new Error("Missing status or payment status");
//   }

//   const updateData = {};
//   if (status) updateData.status = status;
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

  if (!status && !paymentStatus) {
    throw new Error("Missing status or payment status");
  }

  const updateData = {};
  if (status) {
    updateData.status = status;

    
    if (status === "Delivered") {
      updateData.deliveryDate = new Date();
      // updateData.paymentStatus = "Paid";
    }
  }

  if (paymentStatus) updateData.paymentStatus = paymentStatus;

  const response = await Order.findByIdAndUpdate(oid, updateData, { new: true });

  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "Something went wrong",
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



// const cancelOrder = asyncHandler(async (req, res) => {
//   const { oid } = req.params;
//   const userId = req.user._id;
  
//   try {
//       const order = await Order.findById(oid).populate('products.product');

//       if (!order) {
//           return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
//       }

//       if (!order.orderBy.equals(userId)) {
//           return res.status(403).json({ success: false, message: 'Bạn không có quyền hủy đơn hàng này' });
//       }

//       if (order.status !== 'Awaiting Confirmation') {
//           return res.status(400).json({ success: false, message: 'Không thể hủy đơn hàng này' });
//       }

//       await Promise.all(
//           order.products.map(async (item) => {
//               await Product.findByIdAndUpdate(item.product._id, {
//                   $inc: { quantity: item.quantity }, 
//               });
//           })
//       );

//       order.status = 'Cancelled';
//       await order.save();

//       res.json({ success: true, message: 'Đơn hàng đã được hủy thành công', order });
      
//   } catch (error) {
//       console.error('Error cancelling order:', error);
//       res.status(500).json({ success: false, message: 'Lỗi server', error });
//   }
// });

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
                  $inc: { quantity: item.quantity },
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


const getOrderbyAdmin = asyncHandler(async (req, res) => {
  try {
    const queries = { ...req.query };
    const { _id } = req.user; // Get the admin user's ID
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    // Advanced Filtering (optional)
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );
    const formattedQueries = JSON.parse(queryString);

    // Building the query for all orders
    let queryCommand = Order.find(formattedQueries);

    queryCommand = queryCommand.populate(
      "orderBy",
      "firstname lastname mobile"
    );

    if (queries.name) {
      finalQuery["$or"] = [
        { "orderBy.firstname": { $regex: queries.name, $options: "i" } },
        { "orderBy.lastname": { $regex: queries.name, $options: "i" } }
      ];
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
    const counts = await Order.countDocuments(formattedQueries); // Get total count of orders

    // Response
    return res.status(200).json({
      success: true,
      orders: orders,
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




module.exports = {
  createOrder,
  updateStatus,
  cancelOrder,
  getOrderbyUser,
  getOrderbyAdmin,
  updatePaymentStatus,
  getOrderDetail,
  getOrdersToday,
};
