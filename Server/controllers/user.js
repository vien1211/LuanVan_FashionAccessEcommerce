const User = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultils/sendMail");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const makeToken = require("uniqid");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GG_CLIENT_ID, process.env.GG_CLIENT_SECRET);

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN;
 
const twilio = require("twilio")
const clientPN = require('twilio')(accountSid, authToken);

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
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const register = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword, firstname, lastname, mobile } = req.body;

  // Check for missing inputs
  if (!email || !password || !confirmPassword || !firstname || !lastname || !mobile) {
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  }

  // if (!passwordRegex.test(password)) {
  //   return res.status(400).json({
  //     success: false,
  //     mes: "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  //   });
  // }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      mes: "Passwords do not match",
    });
  }
  
  if (!mobile.startsWith("+84")) {
    mobile = `+84${mobile.slice(1)}`;
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

// const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return res.status(400).json({
//       success: false,
//       mes: "Missing inputs",
//     });

//   const response = await User.findOne({ email });
//   if (response && (await response.isCorrectPassword(password))) {
//     const { password, role, refreshToken, ...userData } = response.toObject();
//     const accessToken = generateAccessToken(response._id, role);
//     const newRefreshToken = generateRefreshToken(response._id);
//     await User.findByIdAndUpdate(
//       response._id,
//       { refreshToken: newRefreshToken },
//       { new: true }
//     );
//     //Lưu RefreshToken vào cookie
//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 1000,
//     });
//     return res.status(200).json({
//       success: true,
//       accessToken,
//       userData,
//     });
//   } else {
//     throw new Error("Invalid credentials!");
//   }
// });

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  
    // if (!passwordRegex.test(password)) {
    //   return res.status(400).json({
    //     success: false,
    //     mes: "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    //   });
    // }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      mes: "User not found!",
    });
  }

  // Kiểm tra xem tài khoản có bị chặn hay không
  if (user.isBlocked) {
    return res.status(403).json({
      success: false,
      mes: "Your account has been blocked due to multiple failed login attempts. Please contact support.",
    });
  }

  if (await user.isCorrectPassword(password)) {
    // Đăng nhập thành công, reset lại số lần đăng nhập thất bại
    user.loginAttempts = 0;
    await user.save();

    const { password, role, refreshToken, ...userData } = user.toObject();
    const accessToken = generateAccessToken(user._id, role);
    const newRefreshToken = generateRefreshToken(user._id);
    
    // Cập nhật refreshToken trong cơ sở dữ liệu
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );

    // Lưu refreshToken vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 1000, // 7 ngày
    });

    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    // Nếu mật khẩu không chính xác
    user.loginAttempts += 1;

    if (user.loginAttempts >= 3) {
      user.isBlocked = true; // Chặn tài khoản sau 3 lần thất bại
    }

    await user.save(); // Lưu trạng thái số lần đăng nhập thất bại và chặn

    return res.status(401).json({
      success: false,
      mes: user.isBlocked
        ? "Your account has been blocked after 3 failed attempts."
        : "Wrong Password!",
    });
  }
});


const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id)
    .select("-refreshToken -password")
    .populate({
      path: "cart",
      populate: {
        path: "product",
        select: "title images price ",
      },
    })
    .populate("wishlist", "title images price color sold")
    .populate('likes', "title") 
    .populate('dislikes', "title");

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
        { firstname: { $regex: req.query.q, $options: "i" } },
        { lastname: { $regex: req.query.q, $options: "i" } },
        { email: { $regex: req.query.q, $options: "i" } },
        { mobile: { $regex: req.query.q, $options: "i" } },
      ];
    }
    console.log(formattedQueries);

    let queryCommand = User.find(formattedQueries);

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
  const { firstname, lastname, email, mobile, address } = req.body;
  const data = { firstname, lastname, email, mobile, address };
  if (req.file) data.avatar = req.file.path;
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
  if (req.body.mobile && !req.body.mobile.startsWith("+84")) {
    req.body.mobile = `+84${req.body.mobile.slice(1)}`;
  }
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role");
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Updated" : "Something went wrong",
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user; // Lấy ID của người dùng từ token
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");

  // Giả sử req.body là một đối tượng địa chỉ, có thể điều chỉnh nếu cần
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body } }, // Thêm địa chỉ vào mảng địa chỉ
    { new: true }
  ).select("-password -role"); // Không trả về password và role

  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Something went wrong",
  });
});


const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity = 1, color, price, image, title } = req.body;
  if (!pid || !color) throw new Error("Missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid && el.color === color
  );
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        {
          $set: {
            "cart.$.quantity": quantity,
            "cart.$.price": price,
            "cart.$.image": image,
            "cart.$.title": title,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Updated your cart" : "Something went wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: { cart: { product: pid, quantity, color, price, image, title } },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Updated your cart" : "Something went wrong",
    });
  }
});

const removeProductInCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, color } = req.params;

  // Find the user and check if the product exists in the cart
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid && el.color === color
  );

  // If the product doesn't exist in the cart, return an error message
  if (!alreadyProduct) {
    return res.status(404).json({
      success: false,
      mes: "Product not found in your cart",
    });
  }

  // Remove the product from the cart
  const response = await User.findByIdAndUpdate(
    _id,
    { $pull: { cart: { product: pid, color } } },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Removed product from your cart" : "Something went wrong",
    cart: response.cart,
  });
});

const updateWishList = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { _id } = req.user;
  const user = await User.findById(_id);
  const alreadyWishList = user.wishlist?.find((el) => el.toString() === pid);
  if (alreadyWishList) {
    const response = await User.findByIdAndUpdate(
      _id,
      { $pull: { wishlist: pid } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "Updated your Wishlist" : "Fail to update Wishlist",
    });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { wishlist: pid } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "Updated your Wishlist" : "Fail to update Wishlist",
    });
  }
});


const getUsersToday = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const usersToday = await User.find({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });

  return res.json({
    success: true,
    users: usersToday,
    counts: usersToday.length,
  });
});


// const googleLogin = asyncHandler(async (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({
//       success: false,
//       mes: "Missing token",
//     });
//   }

//   try {
//     // Xác thực token với Google
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GG_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name } = payload;

//     // Kiểm tra người dùng có tồn tại trong database không
//     let user = await User.findOne({ email });

//     if (!user) {
//       // Nếu người dùng không tồn tại, tạo một người dùng mới
//       user = await User.create({
//         email,
//         name,
//         password: "",    // Vì đăng nhập bằng Google, không cần mật khẩu
//       });
//     }

//     const { password, role, refreshToken, ...userData } = user.toObject();

//     // Tạo access token và refresh token
//     const accessToken = generateAccessToken(user._id, role);
//     const newRefreshToken = generateRefreshToken(user._id);

//     // Lưu refreshToken vào database
//     await User.findByIdAndUpdate(
//       user._id,
//       { refreshToken: newRefreshToken },
//       { new: true }
//     );

//     // Lưu refreshToken vào cookie
//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
//     });

//     // Trả về accessToken và dữ liệu người dùng
//     return res.status(200).json({
//       success: true,
//       accessToken,
//       userData,
//     });
//   } catch (error) {
//     console.error("Google login error:", error);
//     return res.status(500).json({
//       success: false,
//       mes: "Google login failed",
//     });
//   }
// });
const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      mes: "Missing token",
    });
  }

  try {
    // Xác thực token với Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GG_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    // Ghi lại log để kiểm tra payload trả về từ Google
    console.log("Google payload:", payload);

    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        mes: "Email not found in Google token",
      });
    }

    // Tách họ và tên từ name nếu firstname và lastname không tồn tại
    const [firstname = "", lastname = ""] = name ? name.split(" ") : ["", ""];

    // Kiểm tra người dùng có tồn tại trong database không
    let user = await User.findOne({ email });

    if (!user) {
      // Nếu người dùng không tồn tại, tạo một người dùng mới
      user = await User.create({
        email,
        firstname,
        lastname,
        password: "",  // Vì đăng nhập bằng Google, không cần mật khẩu
      });
    }

    const { password, role, refreshToken, ...userData } = user.toObject();

    // Tạo access token và refresh token
    const accessToken = generateAccessToken(user._id, role);
    const newRefreshToken = generateRefreshToken(user._id);

    // Lưu refreshToken vào database
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );

    // Lưu refreshToken vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // Trả về accessToken và dữ liệu người dùng
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } catch (error) {
    console.error("Google login error:", error);

    return res.status(500).json({
      success: false,
      mes: error.message || "Google login failed",
    });
  }
});

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Missing email" });
  }

  if (email === req.user?.email) {
    return res.status(400).json({ success: false, message: "New email cannot be the same as the current email" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already in use" });
  }

  const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase(); // Generate verification code
  await User.findByIdAndUpdate(req.user?._id);

  // HTML email structure
  const html = `
    <div style="
        font-family: Poppins, sans-serif;
        max-width: 600px;
        padding: 20px; 
        border-radius: 10px; 
        background-color: #f1f1f1;
    ">
      <h2 style="
          text-align: center; 
          font-size: 30px; 
          color: #6D8777;
          font-weight: bold;
      ">Email Verification Code</h2>
      
      <p style="
          font-size: 16px; 
          color: #555;
          margin-bottom: 10px;
      ">You requested a verification code to change to new Email. Use the code below to complete your email verification.</p>
      
      <p style="
          font-size: 32px; 
          font-weight: bold; 
          text-align: center;
          color: #FFE7B4;
          background: #6D8777;
          border-radius: 10px; 
          width: 150px;
          padding: 5px;
          margin: auto;
      ">${verificationCode}</p>
      
      <p style="
          font-size: 14px; 
          color: #999;
          margin-top: 10px;
      ">If you did not request this, please ignore this email.</p>
    </div>
  `;

  try {
    await sendMail({
      email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${verificationCode}`,
      html,
    });
    return res.status(200).json({ success: true, message: "Verification code sent" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error sending verification code" });
  }
};

const verifyCodeAndUpdateEmail = async (req, res) => {
  const { verificationCode, email } = req.body;

  if (!verificationCode || !email) {
    return res.status(400).json({ success: false, message: 'Missing inputs' });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  const user = await User.findById(req.user._id, {
    verificationCode,
    verificationCodeExpires: Date.now() + 10 * 60 * 1000, // Code valid for 10 minutes
  });
  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }

  if (user.verificationCodeExpires < Date.now()) {
    return res.status(400).json({ success: false, message: 'Verification code has expired' });
  }

  if (user.verificationCode !== verificationCode) {
    return res.status(400).json({ success: false, message: 'Invalid verification code' });
  }

  user.email = email; // Update email
  user.verificationCode = undefined; // Clear verification code
  user.verificationCodeExpires = undefined; // Clear expiration
  await user.save();

  return res.status(200).json({ success: true, message: 'Email updated successfully' });
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Missing old or new password' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect old password' });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from the old password' });
    }

    const salt = await bcrypt.genSaltSync(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordChangeAt = Date.now(); 

    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const sendOTP = async (req, res) => {
  let { mobile } = req.body;

  // Chuẩn hóa số điện thoại với mã quốc gia nếu chưa có
  if (!mobile?.startsWith("+")) {
    mobile = `+84${mobile.slice(1)}`;
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // if (user.mobile === mobile) {
    //   return res.status(400).send("New phone number cannot be the same as the current number.");
    // }

    // const existingUser = await User.findOne({ mobile });
    // if (existingUser && existingUser._id !== user._id) {
    //   return res.status(400).send("This phone number is already associated with another account.");
    // }

    // Gửi OTP qua dịch vụ Verify của Twilio
    await clientPN.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: mobile,
        channel: "sms",
      });

    // Lưu thông tin OTP vào cơ sở dữ liệu
    user.newMobile = mobile;
    await user.save();

    res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error("Error in sendOTP:", error);
    res.status(500).send("Failed to send OTP");
  }
};

const verifyAndUpdateMobile = async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Xác minh OTP thông qua dịch vụ Verify của Twilio
    const verification = await clientPN.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: user.newMobile,
        code: otp,
      });

    if (verification.status === "approved") {
      // Cập nhật số điện thoại sau khi OTP hợp lệ
      user.mobile = user.newMobile;
      user.newMobile = undefined; // Xóa số mới sau khi xác nhận
      await user.save();

      res.status(200).send("Mobile number updated successfully");
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    console.error("Error in verifyAndUpdateMobile:", error);
    res.status(500).send("Failed to verify OTP and update mobile number");
  }
};

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
  removeProductInCart,
  updateWishList,
  getUsersToday,
  googleLogin,
  sendVerificationCode,
  verifyCodeAndUpdateEmail,
  changePassword,
  sendOTP,
  verifyAndUpdateMobile,
  
};
