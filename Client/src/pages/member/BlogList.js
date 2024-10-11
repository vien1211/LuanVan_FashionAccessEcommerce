import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector to get user info
import { Link, useSearchParams } from "react-router-dom";
import { apiGetAllBlog } from "../../apis";
import { BlogCard, Pagination } from "../../components";
import moment from "moment";
import DOMPurify from "dompurify";
import UpdateBlog from "../admin/UpdateBlog";

const BlogList = () => {
  const [blog, setBlog] = useState([]);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();
  const [update, setUpdate] = useState(false);
  const [editBlog, setEditBlog] = useState(null);

  // Get the current user from the Redux store
  const { current } = useSelector((state) => state.user);

  const fetchAllBlog = async (params) => {
    // Only fetch blogs created by the current user
    const response = await apiGetAllBlog({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
      author: current.firstname,
    });
    if (response.success) {
      setCounts(response.counts);
      setBlog(response.AllBlog);
    }
  };

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchAllBlog(searchParams);
  }, [params, update]);

  return (
    <div className="w-full p-6 my-4 relative">
      {editBlog && (
        <div className="absolute inset-0 z-50 min-h-screen bg-[#F5F5FA] ">
          <UpdateBlog
            editBlog={editBlog}
            render={render}
            setEditBlog={setEditBlog}
          />
        </div>
      )}
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>My Blog Posts</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 ">
        {blog.length > 0 ? (
          blog.map((el) => (
            <div
              key={el._id}
              className="border text-gray-600 rounded-lg p-4 shadow-md bg-white transform transition duration-300 hover:scale-105 hover:shadow-xl hover:border-[#a8f5bf]"
            >
              <div className="flex flex-col justify-between">
                {/* Blog Image */}
                <img
                  src={el.image}
                  alt="Blog"
                  className="w-full h-[200px] object-cover rounded-md mb-4"
                />

                <div className="p-2 flex items-center text-main space-x-2">
                  <span className="text-[16px] font-semibold line-clamp-1">
                    {moment(blog.createdAt).format("DD [Th]MM")}
                  </span>
                  <span className="mx-1 text-gray-500">•</span>
                  <span className="text-[16px] font-semibold uppercase line-clamp-1">
                    {el?.category?.title}
                  </span>
                </div>

                {/* Blog Title */}
                <h3 className="px-2 font-semibold text-lg text-main mb-2">
                  {el.title}
                </h3>

                <div className="space-x-2 py-2 px-2 mb-2">
                  <span className="bg-[#f1cbce] text-[#ba3c4d] rounded-full px-2 py-1">
                    {el.likesCount} Like
                  </span>
                  <span className="bg-[#c4a8ef] text-[#551cb0] rounded-full px-2 py-1">
                    {el.dislikesCount} DisLike
                  </span>
                  <span className="bg-[#a8ceef] text-[#6080c6] rounded-full px-2 py-1">
                    {el.comment.length} Comment
                  </span>
                </div>

                {/* Blog Description */}
                <div
                  className="px-2 text-[14px] font-light text-gray-700 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(el?.description),
                  }}
                />
              </div>

              <div className=" px-2 py-3 flex gap-2">
                <Link to={`/${el._id}/${el.title.replace(/\s+/g, "-")}`}>
                  <span className="flex items-center justify-center h-10 px-3 text-white cursor-pointer bg-main rounded-[5px] hover:bg-[#79a076]">
                    View Blog
                  </span>
                </Link>
                <span
                  onClick={() => setEditBlog(el)}
                  className="flex items-center justify-center h-10 px-3 text-white cursor-pointer bg-[#ac8153] rounded-[5px] hover:bg-yellow-600"
                >
                  Edit Blog
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">No blog posts found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex w-full px-4">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default BlogList;
