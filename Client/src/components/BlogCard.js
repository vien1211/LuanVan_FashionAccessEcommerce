// src/components/BlogCard.js

import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import DOMPurify from "dompurify";
import path from "../ultils/path";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <Link
              to={path.DETAIL_BLOG?.replace(":bid", blog._id)?.replace(
                ":title",
                blog.title?.replace(/\s+/g, "-")
              )}
            >
        <img
          src={blog?.image}
          alt={blog.title}
          className="w-full h-56 object-cover object-center hover:opacity-80 transition-opacity duration-200"
        />

        <div className="p-4 flex items-center text-main space-x-2">
          <span className="text-[16px] font-semibold line-clamp-1">
            {moment(blog.createdAt).format("DD [Th]MM")}
          </span>
          <span className="mx-1 text-gray-500">•</span>
          <span className="text-[16px] font-semibold uppercase line-clamp-1">
            {blog?.category?.title}
          </span>
        </div>

        <div className="px-4">
          <h2 className="text-[20px] font-semibold text-[#3C5643] mb-2 line-clamp-2">
            {blog.title}
          </h2>

          <div
            className="text-[14px] font-light text-gray-700 line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog?.description),
            }}
          />
        </div>
        <div className="p-4 flex items-center text-gray-700 space-x-2">
          <span className="text-[14px] font-semibold uppercase text-[#3C5643]">
            <span>By </span>
            <span>
              {blog.author?.firstname} {blog.author?.lastname}
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
