const User = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultils/sendMail");
const crypto = require("crypto");
const makeToken = require("uniqid");

// const register = asyncHandler(async(req, res) => {
//     const { email, password, firstname, lastname } = req.body;

//     if (!email || !password || !firstname || !lastname) {
//         return res.status(400).json({
//             success: false,
//             mes: 'Missing inputs'
//         });
//     }

//     const user = await User.findOne({ email });
//     if (user) {
//         return res.status(400).json({
//             success: false,
//             mes: 'User already exists'
//         });
//     } else {
//         const newUser = await User.create(req.body);
//         return res.status(201).json({
//             success: true,
//             mes: 'Registration successful'
//         });
//     }
// });

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;

  // Check for missing inputs
  if (!email || !password || !firstname || !lastname || !mobile) {
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      mes: "User already exists",
    });
  } else {
    const token = makeToken();

    // Set a cookie with the token
    res.cookie(
      "dataregister",
      { ...req.body, token },
      {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      }
    );

    // Send verification email
    //const html = `Please click this link to verify your account. This link will expire within 15 minutes. <a href="${process.env.URL_SERVER}/api/user/verifyregister/${token}">Click here</a>`;
    const html = `
      <div style="
        font-family: Poppins, sans-serif;
        max-width: 600px;
        padding: 20px; 
        border-radius: 10px; 
        background-color: #f1f1f1;
      ">
        <h2 style="
          font-size: 40px;
          text-align: center;
          font-weight: bold;
          text-transform: uppercase;
          color: #6D8777;
        ">
          Welcome to Our Service!
        </h2>
        <p style="color: #555;">Hi <strong>${firstname}</strong>,</p>
        <p style="color: #555;">Thank you for registering with us. To complete your registration, please verify your email by clicking the link below:</p>
        <a 
          href="${process.env.URL_SERVER}/api/user/verifyregister/${token}"
          style="
            display: inline-block; 
            padding: 10px 20px; 
            margin: 20px 0; 
            background-color: #6D8777; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px;
            ">
              Verify Your Account
        </a>
        <p style="color: #555;">This link will expire in 15 minutes. If you did not request this, please ignore this email.</p>
        <p style="color: #555;">Best regards,<br/>Vieen's Store</p>
        
        <hr style="border: 0; height: 1px; background-color: #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">If you're having trouble clicking the "Verify Your Account" button, copy and paste the URL below into your web browser:</p>
        <p style="color: #999; font-size: 12px;">${process.env.URL_SERVER}/api/user/verifyregister/${token}</p>
      </div>
    `;

    try {
      await sendMail({
        email,
        html,
        subject: "Complete your registration",
      });
    } catch (emailError) {
      return res.status(500).json({
        success: false,
        mes: "Failed to send verification email.",
      });
    }

    return res.json({
      success: true,
      mes: "Please check your email to activate your account.",
    });
  }
});

const verifyregister = asyncHandler(async (req, res) => {
  const { dataregister } = req.cookies;
  const { token } = req.params;

  if (!dataregister || dataregister.token !== token) {
    res.clearCookie("dataregister");
    return res.redirect(`${process.env.CLIENT_URL}/verifyregister/failed`);
  }

  const newUser = await User.create({
    email: dataregister.email,
    password: dataregister.password,
    mobile: dataregister.mobile,
    firstname: dataregister.firstname,
    lastname: dataregister.lastname,
  });
  res.clearCookie("dataregister");
  if (newUser)
    return res.redirect(`${process.env.CLIENT_URL}/verifyregister/success`);
  else return res.redirect(`${process.env.CLIENT_URL}/verifyregister/failed`);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });

  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, role, refreshToken, ...userData } = response.toObject();
    const accessToken = generateAccessToken(response._id, role);
    const newRefreshToken = generateRefreshToken(response._id);
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    //Lưu RefreshToken vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password");
  
  if (user) {
    return res.status(200).json({
      success: true,
      rs: user, 
    });
  } else {
    return res.status(404).json({
      success: false,
      rs: "User not found!",
    });
  }
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookie!");
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: decode._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched!",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookie!");
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing Email!");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User Not Found!");
  const resetToken = user.createPasswordChangeToken();
  await user.save();

  const html = `Please, click this link to change your Password. This link will expire within 15 minutes. <a
    href=${process.env.CLIENT_URL}/reset-password/${resetToken}> Click here</a>`;

  const data = {
    email,
    html,
    subject: "Forgot Password",
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    mes: rs.response?.includes("OK") ? "Please check your mail" : "Oops! Wrong",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired reset token");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password has been updated successfully",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  try {
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);
    
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
    const formattedQueries = JSON.parse(queryString);
    
    // Filtering
    if (queries?.name) formattedQueries.name = { $regex: queries.name, $options: 'i' };
    
    
    if(req.query.q){
      delete formattedQueries.q
      formattedQueries['$or'] = [
        {firstname : { $regex: req.query.q, $options: 'i' }},
        {lastname : { $regex: req.query.q, $options: 'i' }},
        {email : { $regex: req.query.q, $options: 'i' }},
        {mobile : { $regex: req.query.q, $options: 'i' }}
      ]
    }
    console.log(formattedQueries)

    let queryCommand = User.find(formattedQueries);
    
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      queryCommand = queryCommand.sort(sortBy);
    } else {
      queryCommand = queryCommand.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      queryCommand = queryCommand.select(fields);
    } else {
      queryCommand = queryCommand.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    const users = await queryCommand.exec();
    const counts = await User.countDocuments(formattedQueries);

    return res.status(200).json({
      success: true,
      users: users,
      counts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const response = await User.findByIdAndDelete(uid);
  return res.status(200).json({
    success: response ? true : false,
    mes: response
      ? `Usser With Email ${response.email} Deleted`
      : "No User Deleted",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {firstname, lastname, email, mobile} = req.body
  const data ={firstname, lastname, email, mobile}
  if (req.file) data.avatar = req.file.path
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(_id, data, {
    new: true,
  }).select("-password -role");
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Updated" : "Something went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role");
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? 'Updated' : "Something went wrong",
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body } },
    { new: true }
  ).select("-password -role");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Something went wrong",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Something went wrong",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: pid, quantity, color } } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Something went wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Something went wrong",
    });
  }
});

// const updateCart = asyncHandler(async(req, res) => {
//     const { _id } = req.user;
//     const { pid, quantity, color } = req.body;

//     if (!pid || !quantity || !color) throw new Error('Missing inputs');

//     const user = await User.findById(_id).select('cart');

//     if (!user) {
//         return res.status(404).json({
//             success: false,
//             message: 'User not found'
//         });
//     }

//     const alreadyProduct = user.cart.find(el => el.product.toString() === pid);

//     if (alreadyProduct) {
//         // Update the quantity and/or color of the existing product in the cart
//         alreadyProduct.quantity = quantity;
//         alreadyProduct.color = color;
//     } else {
//         // Add the new product to the cart
//         user.cart.push({ product: pid, quantity, color });
//     }

//     // Save the updated user document
//     const updatedUser = await user.save();

//     return res.status(200).json({
//         success: true,
//         updatedUser: updatedUser.cart
//     });
// });

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
  verifyregister,
};
