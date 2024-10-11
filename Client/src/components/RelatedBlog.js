// import React, { useState, useEffect } from "react";
// import { useParams, useSearchParams } from "react-router-dom";

// import BlogCard from "./BlogCard";
// import Slider from "react-slick";
// import { apiGetAllBlog } from "../apis";

// const settings = {
//   dots: false,
//   infinite: false,
//   speed: 500,
//   slidesToShow: 3,
//   slidesToScroll: 1,
// };

// const RelatedBlog = () => {
//   const [relatedBlogs, setRelatedBlogs] = useState([]);
//   const { category } = useParams();
//   const [params] = useSearchParams();

//   const fetchBlogs = async (params) => {
//     const response = await apiGetAllBlog({
//       ...params,
//       limit: process.env.REACT_APP_LIMIT,
//     });
//     if (response.success) {
//       setRelatedBlogs(response.AllBlog);
//     }
//   };

//   useEffect(() => {
//     const searchParams = Object.fromEntries([...params]);
//     fetchBlogs(searchParams);
//   }, [params]);

//   return (
//     <div className="max-w-6xl mx-auto px-8 py-2 border rounded-lg shadow-lg mb-8">
//       <h3 className="text-[24px] text-[rgb(61,87,68)] font-semibold my-2">Related Blogs</h3>
//       {relatedBlogs.length === 0 ? (
//         <div className="text-center py-4 text-gray-500">No related blogs available.</div>
//       ) : (
//         <Slider {...settings}>
//           {relatedBlogs.map((blog) => (
//             <div key={blog._id} className="px-3 mt-3">
//               <BlogCard blog={blog} />
//             </div>
//           ))}
//         </Slider>
//       )}
//     </div>
//   );
// };

// export default RelatedBlog;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // We'll use useParams for author
import BlogCard from "./BlogCard";
import Slider from "react-slick";
import { apiGetAllBlog } from "../apis";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const RelatedBlog = ({ currentAuthor }) => {
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const { author } = useParams(); // Get the author from the URL or blog

  const fetchBlogs = async (author) => {
    const response = await apiGetAllBlog({
      author: currentAuthor, // Fetch blogs by the current author
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setRelatedBlogs(response.AllBlog);
    }
  };

  useEffect(() => {
    if (currentAuthor) {
      fetchBlogs(currentAuthor);
    }
  }, [currentAuthor]);

  return (
    <div className="max-w-6xl mx-auto px-8 py-2 border rounded-2xl shadow-lg mb-8">
      <h3 className="text-[24px] text-[rgb(61,87,68)] font-semibold my-2">
        Related Blogs 
      </h3>
      {relatedBlogs.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No related blogs available.
        </div>
      ) : (
        <Slider {...settings} className="w-full">
          {relatedBlogs.map((blog) => (
            <div key={blog._id} className="px-3 py-6">
              <BlogCard blog={blog} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default RelatedBlog;

