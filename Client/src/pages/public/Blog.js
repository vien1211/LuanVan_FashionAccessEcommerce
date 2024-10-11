// import React, { useEffect, useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { apiGetAllBlog } from "../../apis";
// import path from "../../ultils/path";
// import { Pagination } from "../../components";
// import moment from "moment";
// import DOMPurify from "dompurify";

// const Blog = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [counts, setCounts] = useState(0);
//   const [params] = useSearchParams();

//   const fetchBlogs = async (params) => {
//     const response = await apiGetAllBlog({
//       ...params,
//       limit: process.env.REACT_APP_LIMIT,
//     });
//     if (response.success) {
//       setCounts(response.counts);
//       setBlogs(response.AllBlog);
//     }
//   };

//   useEffect(() => {
//     const searchParams = Object.fromEntries([...params]);
//     fetchBlogs(searchParams);
//   }, [params]);

//   return (
//     <div className="max-w-7xl mx-auto p-5">
//       <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
//         Our Latest Blogs
//       </h1>
//       <div className="grid grid-cols-3 gap-8 mb-8">
//         {blogs?.map((blog) => (
//           <div
//             key={blog._id}
//             className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
//           >
//             <Link
//               to={path.DETAIL_BLOG.replace(":bid", blog._id).replace(
//                 ":title",
//                 blog.title.replace(/\s+/g, "-")
//               )}
//             >
//               <img
//                 src={blog?.image}
//                 alt={blog.title}
//                 className="w-full h-56 object-cover object-center hover:opacity-80 transition-opacity duration-200"
//               />

//               <div className="p-4 flex items-center text-main space-x-2">
//                 <span className="text-[16px] font-semibold">
//                   {moment(blog.createdAt).format("DD [Th]MM")}
//                 </span>
//                 <span className="mx-1 text-gray-500">•</span>
//                 <span className="text-[16px] font-semibold uppercase">
//                   {blog?.category?.title}
//                 </span>
//               </div>

//               <div className="px-4">
//                 <h2 className="text-[20px] font-semibold text-[#3C5643] mb-2">
//                   {blog.title}
//                 </h2>

//                 <div
//                   className="text-[14px] font-light text-gray-700 line-clamp-3"
//                   dangerouslySetInnerHTML={{
//                     __html: DOMPurify.sanitize(blog?.description),
//                   }}
//                 />
//               </div>
//               <div className="p-4 flex items-center text-gray-700 space-x-2">
//                 <span className="text-[14px] font-semibold uppercase text-[#3C5643]">
//                   <span>By </span>
//                   <span>{blog.author?.firstname} {blog.author?.lastname}</span>
//                 </span>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//       <div className="flex justify-center w-full px-4">
//         <Pagination totalCount={counts} />
//       </div>
//     </div>
//   );
// };

// export default Blog;

// src/pages/public/Blog.js

import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiGetAllBlog } from "../../apis";
import path from "../../ultils/path";
import { Pagination, BlogCard } from "../../components"; // Import BlogCard
import { BsPatchPlus } from "react-icons/bs";
import moment from "moment";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();

  const fetchBlogs = async (params) => {
    const response = await apiGetAllBlog({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts(response.counts);
      setBlogs(response.AllBlog);
    }
  };

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchBlogs(searchParams);
    window.scrollTo(0, 0);
  }, [params]);

  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="flex justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-center text-gray-800">
            Our Latest Blogs
          </h1>
        </div>
        <div>
          <Link
            to={`/${path.MEMBER}/${path.M_BLOG}`}
            className="flex gap-2 justify-center py-4 px-3 text-main bg-[#eef1ef] shadow-md rounded-[20px] 
                 relative overflow-hidden
                 before:absolute before:inset-0 before:bg-gradient-to-l before:to-main before:from-[#d8ecdf] 
                 before:translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-0
                 hover:text-white hover:shadow-lg ease-in-out transform hover:scale-105"
          >
            <BsPatchPlus className="my-auto z-10" size={24} />
            <span className="z-10">Create Blog Post</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        {blogs?.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
      <div className="flex justify-center w-full px-4">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default Blog;
