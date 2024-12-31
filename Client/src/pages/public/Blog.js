

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
