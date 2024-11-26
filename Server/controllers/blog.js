const Blog = require("../models/blog");
const BlogCategory = require("../models/blogCategory");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing Inputs!");

  const image = req.file?.path;
  if (image) req.body.image = image;

  const existCategory = await BlogCategory.findById(category);
  if (!existCategory) {
    return res.status(400).json({
      success: false,
      message: "Invalid Category ID. Category does not exist.",
    });
  }

  req.body.author = req.user._id;

  const response = await Blog.create(req.body);
  return res.json({
    success: response ? true : false,
    createdBlog: response ? response : "Cannot Create New Blog! ",
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const image = req.file?.path;
  if (image) req.body.image = image;
  if (Object.keys(req.body).length === 0) throw new Error("Missing Inputs!");
  const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
  return res.json({
    success: response ? true : false,
    updatedBlog: response ? response : "Cannot Update Blog!",
  });
});


const getAllBlog = asyncHandler(async (req, res) => {
    try {
      const queries = { ...req.query };
      const excludeFields = ["limit", "sort", "page", "fields", "q"];
      
      // Exclude specified fields from the query
      excludeFields.forEach((el) => delete queries[el]);
  
      // Advanced Filtering (title, category, etc.)
      let queryString = JSON.stringify(queries);
      queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (match) => `$${match}`
      );
      const formattedQueries = JSON.parse(queryString);

      if (queries?.title)
        formattedQueries.title = { $regex: queries.title, $options: "i" };

      if (queries?.author) {
        const author = await User.findOne({ firstname: queries.author }).select('_id');
        if (author) {
          formattedQueries.author = author._id;
        } else {
          return res.status(200).json({ success: true, AllBlog: [], counts: 0 });
        }
      }

      if (queries?.category) {
        const categoryId = await BlogCategory.findOne({ title: queries.category }).select('_id');
        if (categoryId) {
          formattedQueries.category = categoryId._id;
        } else {
          return res.status(200).json({ success: true, AllBlog: [], counts: 0 });
        }
      }
  
      if (req.query.q) {
        delete formattedQueries.q;
        formattedQueries["$or"] = [
          { title: { $regex: req.query.q, $options: "i" } },
          // { author: { $regex: req.query.q, $options: "i" } },
          { address: { $regex: req.query.q, $options: "i" } },
          { contact: { $regex: req.query.q, $options: "i" } },
        ];
      }
  
    //   if (queries?.title) {
    //     formattedQueries.title = { $regex: queries.title, $options: "i" };
    //   }
    

   
  
    //   // Merging search queries if provided
    //   let queryObject = {};
    //   if (queries?.q) {
    //     delete formattedQueries.q;
    //     queryObject = {
    //       $or: [
    //         { title: { $regex: queries.q, $options: "i" } },
    //         { content: { $regex: queries.q, $options: "i" } },
    //         { category: { $regex: queries.q, $options: "i" } },
    //       ],
    //     };
    //   }
  
    //   // Merging all queries
    //   const finalQuery = {
    //     ...formattedQueries,
    //     ...queryObject,
    //   };

    //   if (req.user && req.user._id) {
    //     finalQuery.author = req.user._id;  // Only get blogs by the logged-in user
    //   }
  
      // Building the query
      let queryCommand = Blog.find(formattedQueries)
        .populate("category", "title")
        .populate("author", "firstname lastname")
        .populate({
          path: "comment",
          populate: {
            path: "postedBy",
            select: "firstname lastname avatar", 
          },
        })

        
  
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
      const blogs = await queryCommand.exec();
      
      const counts = await Blog.countDocuments(formattedQueries);
      
      // Response
      return res.status(200).json({
        success: true,
        AllBlog: blogs,
        counts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });  
  



const likeBlog = async (req, res) => {
  const { _id } = req.user; // ID người dùng
  const { bid } = req.params; // ID bài viết

  try {
    const blog = await Blog.findById(bid);
    const user = await User.findById(_id);

    if (!blog || !user) {
      return res
        .status(404)
        .json({ success: false, message: "Blog or User not found" });
    }

    // Nếu người dùng đã thích blog, bỏ thích
    if (blog.likes.includes(_id)) {
      blog.likes.pull(_id); // Bỏ ID người dùng ra khỏi mảng likes của blog
      blog.likesCount -= 1; // Giảm số lượng likes
      user.likes.pull(bid); // Bỏ ID bài viết ra khỏi mảng likes của người dùng
    } else {
      // Nếu người dùng đã không thích blog, bỏ không thích trước
      if (blog.dislikes.includes(_id)) {
        blog.dislikes.pull(_id); // Bỏ ID người dùng ra khỏi mảng dislikes của blog
        blog.dislikesCount -= 1; // Giảm số lượng dislikes
        user.dislikes.pull(bid); // Bỏ ID bài viết ra khỏi mảng dislikes của người dùng
      }
      // Thêm người dùng vào mảng thích
      blog.likes.push(_id); // Thêm ID người dùng vào mảng likes của blog
      blog.likesCount += 1; // Tăng số lượng likes
      user.likes.push(bid); // Thêm ID bài viết vào mảng likes của người dùng
    }

    // Lưu blog và người dùng
    await blog.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Blog liked/disliked successfully",
      likesCount: blog.likesCount,
      dislikesCount: blog.dislikesCount,
    });
  } catch (error) {
    console.error("Error in likeBlog:", error); // Log lỗi
    return res.status(500).json({ success: false, message: error.message });
  }
};

const dislikeBlog = async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;

  try {
    const blog = await Blog.findById(bid);
    const user = await User.findById(_id);

    if (!blog || !user) {
      return res
        .status(404)
        .json({ success: false, message: "Blog or User not found" });
    }

    // If user has already disliked the blog, remove the dislike
    if (blog.dislikes.includes(_id)) {
      blog.dislikes.pull(_id);
      blog.dislikesCount -= 1;
      user.dislikes.pull(bid);
    } else {
      // If the user had liked the blog, remove the like first
      if (blog.likes.includes(_id)) {
        blog.likes.pull(_id);
        blog.likesCount -= 1;
        user.likes.pull(bid);
      }
      // Add user to the dislikes array
      blog.dislikes.push(_id);
      blog.dislikesCount += 1;
      user.dislikes.push(bid);
    }

    await blog.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Blog liked/disliked successfully",
      likesCount: blog.likesCount,
      dislikesCount: blog.dislikesCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// const getBlog = asyncHandler(async(req, res) => {
//     const { bid } = req.params
//     const blog = await Blog.findByIdAndUpdate(bid, {$inc: {numberView: 1}}, {new: true})
//         .populate('likes', 'firstname lastname')
//         .populate('dislikes', 'firstname lastname')
//     return res.json({
//         success: blog ? true : false,
//         blog: blog
//     })
// })

const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params; // Get blog ID from request parameters

  // Check if the bid is provided
  if (!bid) {
    return res
      .status(400)
      .json({ success: false, message: "Blog ID is required." });
  }

  // Find the blog by ID and update the view count
  const blog = await Blog.findByIdAndUpdate(
    bid,
    { $inc: { numberView: +1 } },
    { new: true }
  )
    .populate("likes", "firstname lastname") 
    .populate("dislikes", "firstname lastname")
    .populate("category", "title")
    .populate({
        path: "comment",
        populate: {
          path: "postedBy",
          select: "firstname lastname avatar", 
        },
      })
    .populate({
        path: "comment.reply",
        populate: {
          path: "postedBy",
          select: "firstname lastname avatar",
        },
    })
    .populate("author", "firstname lastname avatar");
    
    

  // If the blog is not found, return a 404 response
  if (!blog) {
    return res.status(404).json({ success: false, message: "Blog not found." });
  }

  // Return the blog details along with counts for likes and dislikes
  return res.json({
    success: true,
    // blog: {
    //   _id: blog._id,
    //   title: blog.title,
    //   description: blog.description,
    //   category: blog.category,
    //   numberView: blog.numberView,
    //   likes: blog.likes, // Count of likes
    //   dislikes: blog.dislikes,
    //   likesCount: blog.likes?.length, // Count of likes
    //   dislikesCount: blog.dislikes?.length, // Count of dislikes
    //   image: blog.image,
    //   author: blog.author,
    //   comment: blog.comment,
    //   createdAt: blog.createdAt,
    //   updatedAt: blog.updatedAt,
    // },
    blog
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndDelete(bid);
  return res.json({
    success: blog ? true : false,
    deleteBlog: blog || "Something went wrong",
  });
});

const uploadimagesBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (!req.file) throw new Error("Missing Inputs");
  const response = await Blog.findByIdAndUpdate(
    bid,
    { image: req.file.path },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updatedBlog: response ? response : "Cannot upload image Blog",
  });
});

// const uploadimagesBlog = asyncHandler(async (req, res) => {
//     const { bid } = req.params;

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'Missing Inputs' });
//     }

//     const response = await Blog.findByIdAndUpdate(bid, { image: req.file.path }, { new: true });

//     if (!response) {
//       return res.status(404).json({ success: false, message: 'Cannot upload image Blog' });
//     }

//     return res.status(200).json({
//       success: true,
//       updatedBlog: response
//     });
//   });

const comment = asyncHandler(async (req, res) => {
    const { _id } = req.user; // User ID should be an ObjectId
    const {content, bid, createdAt } = req.body; // Product ID should be an ObjectId
  
    if (!bid || !content) {
      return res.status(400).json({ success: false, message: "Missing Inputs" });
    }
  
    // Validate and convert to ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(bid) ||
      !mongoose.Types.ObjectId.isValid(_id)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ObjectId" });
    }
  
    const blogId = new mongoose.Types.ObjectId(bid);
    const userId = new mongoose.Types.ObjectId(_id);
  
    try {
      const commentBlog = await Blog.findById(blogId);
      if (!commentBlog) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }
  
      const alreadyComment = commentBlog.comment.some(
        (rating) => rating.postedBy.toString() === userId.toString()
      );
  
      if (alreadyComment) {
        // Update existing rating
        await Blog.updateOne(
          { _id: blogId, "comment.postedBy": userId },
          {
            $set: {
              "comment.$.content": content,
              "comment.$.createdAt": createdAt,
            },
          }
        );
      } else {
        // Add new rating
        await Blog.findByIdAndUpdate(blogId, {
          $push: {
            comment: { content, postedBy: userId, createdAt },
          },
        });
      }
  
      
  
      return res.status(200).json({
        success: true,
        commentBlog,
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to submit review. Please try again.",
      });
    }
  });

//   const replyToComment = asyncHandler(async (req, res) => {
//     const { _id } = req.user; // User ID should be an ObjectId
//     const { content, bid, commentId } = req.body; // Blog ID and Comment ID
  
//     if (!bid || !content || !commentId) {
//       return res.status(400).json({ success: false, message: "Missing Inputs" });
//     }
  
//     // Validate and convert to ObjectId
//     if (
//       !mongoose.Types.ObjectId.isValid(bid) ||
//       !mongoose.Types.ObjectId.isValid(commentId) ||
//       !mongoose.Types.ObjectId.isValid(_id)
//     ) {
//       return res.status(400).json({ success: false, message: "Invalid ObjectId" });
//     }
  
//     const blogId = new mongoose.Types.ObjectId(bid);
//     const userId = new mongoose.Types.ObjectId(_id);
  
//     try {
//       const blog = await Blog.findById(blogId);
//       if (!blog) {
//         return res.status(404).json({ success: false, message: "Blog not found" });
//       }
  
//       // Find the comment to reply to
//       const comment = blog.comment.id(commentId);
//       if (!comment) {
//         return res.status(404).json({ success: false, message: "Comment not found" });
//       }
  
//       // Add the reply to the comment's replies array
//       comment.reply.push({
//         content,
//         postedBy: userId,
//         createdAt: new Date(),
//       });
  
//       // Save the updated blog
//       await blog.save();
  
//       return res.status(200).json({
//         success: true,
//         message: "Reply submitted successfully.",
//         blog, // Optionally return the updated blog if needed
//       });
//     } catch (error) {
//       console.error("Error replying to comment:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to submit reply. Please try again.",
//       });
//     }
//   });
  
const replyToComment = asyncHandler(async (req, res) => {
    const { _id } = req.user; // ID của user
    const { content, bid, commentId } = req.body; // ID của blog và comment
  
    if (!bid || !content || !commentId) {
      return res.status(400).json({ success: false, message: "Missing Inputs" });
    }
  
    // Kiểm tra tính hợp lệ của ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(bid) ||
      !mongoose.Types.ObjectId.isValid(commentId) ||
      !mongoose.Types.ObjectId.isValid(_id)
    ) {
      return res.status(400).json({ success: false, message: "Invalid ObjectId" });
    }
  
    try {
      const blog = await Blog.findById(bid);
      if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }
  
      // Tìm comment trong blog để reply
      const comment = blog.comment.id(commentId);
      if (!comment) {
        return res.status(404).json({ success: false, message: "Comment not found" });
      }
  
      // Thêm reply vào mảng reply của comment
      comment.reply.push({
        content,
        postedBy: _id,
        createdAt: new Date(),
      });
  
      // Lưu blog sau khi cập nhật
      await blog.save();
  
      return res.status(200).json({
        success: true,
        message: "Reply submitted successfully.",
        blog, // Trả về blog cập nhật nếu cần
      });
    } catch (error) {
      console.error("Error replying to comment:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to submit reply. Please try again.",
      });
    }
  });
  
  

module.exports = {
  createNewBlog,
  updateBlog,
  getAllBlog,
  likeBlog,
  dislikeBlog,
  getBlog,
  deleteBlog,
  uploadimagesBlog,
  comment,
  replyToComment
};
