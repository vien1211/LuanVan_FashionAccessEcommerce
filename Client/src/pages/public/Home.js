
// import React, { useEffect, useState } from "react";
// import { Banner, BestSellers, NewArrival } from "../../components";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchBrands } from "../../store/brand/AsyncAction";
// import { Link, useSearchParams } from "react-router-dom";
// import Slider from "react-slick";
// import { apiGetAllBlog } from "../../apis";
// import DOMPurify from "dompurify";
// import moment from "moment";
// import fb from "../../assets/fb.jpg";
// import path from "../../ultils/path";
// import star from "../../assets/star.png";
// import shadow from "../../assets/Shadow.png";
// import { BsPatchPlus } from "react-icons/bs";

// // Vertical slider settings for main sections
// const verticalSettings = {
//   dots: true,
//   infinite: true,
//   speed: 800,
//   slidesToShow: 1,
//   slidesToScroll: 1,
//   vertical: true,
//   verticalSwiping: true,
//   afterChange: () => window.scrollTo(0, 0),
// };

// // Horizontal slider settings for the brand collection
// const horizontalSettings = {
//   dots: false,
//   infinite: true,
//   speed: 800,
//   slidesToShow: 5,
//   slidesToScroll: 1,
// };

// const Home = () => {
//   const { categories } = useSelector((state) => state.app);
//   const { brands } = useSelector((state) => state.brand);

//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(fetchBrands());
//   }, [dispatch]);

//   const shuffledCategories = categories
//     ?.filter((el) => el?.title.length > 0)
//     ?.sort(() => 0.5 - Math.random())
//     ?.slice(0, 10);

//   // Shuffle and select 5 random brands
//   const randomBrands = brands
//     ?.filter((el) => el?.title.length > 0)
//     ?.sort(() => 0.5 - Math.random())
//     ?.slice(0, 10);

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
//     window.scrollTo(0, 0);
//   }, [params]);

//   const randomBlog = blogs?.sort(
//     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   )?.[0];

//   const [activeSlide, setActiveSlide] = useState(0);

//   return (
//     <Slider {...verticalSettings} className="vertical-slider" beforeChange={(current, next) => setActiveSlide(next)}>
//       {/* Banner Section */}
      
//       <div className="w-full flex justify-center items-center h-screen animate-slideInUp">
//         <div className="flex flex-col w-full flex-auto">
//           <Banner />
//         </div>
//       </div>


//       <div className="w-full flex justify-center items-center h-screen">
//         <div className="flex flex-row w-full gap-4">
//           <div className="w-full">
//             <BestSellers />
//             <div className=" flex relative">
//       <img
//             src={star}
//             alt="star"
//             className="z-0 object-contain h-[500px] w-[500px] opacity-5 absolute -top-[60px] -right-[50px] animate-spin-slow"
//           />
//       </div>
//           </div>

          
//         </div>
//       </div>

//       <div className="w-full flex justify-center items-center h-screen">
//         <div className="flex flex-row w-full gap-4">
//           <div className="w-full">
//             <NewArrival />
//           </div>
//         </div>
//       </div>

//       {/* OUR BRAND COLLECTION (Grid Layout) */}
//       <div className="w-full flex justify-center items-center h-screen px-6">
//         <div className="flex p-2 rounded-t-[17px] justify-center items-center">
//           <div className="font-semibold uppercase text-white font-playfair text-[32px] text-center">
//             Our brands collection
//           </div>

//           <div className="flex-1 border-b border-gray-300 mx-2"></div>
//         </div>

//         <div className="font-extralight text-[20px] text-white text-left p-2">
//           <span>
//             We are proud of products from reputable brands and of the highest
//             quality. Which do you like?
//           </span>
//         </div>

//         {/* Use a grid layout for brands */}
//         <div className="brands-grid">
//           {randomBrands?.map((el) => (
//             <Link
//               to={`/products?brand=${el.title}`}
//               key={el._id}
//               className="flex flex-col items-center"
//             >
//               <div className="bubble-effect">
//                 <img
//                   src={el.image}
//                   alt={el.title}
//                   className="w-[145px] h-[145px] object-contain rounded-full border-2 border-[#7ca07a] bg-white"
//                 />
//                 <h4 className="font-semibold text-[16px] text-white uppercase text-center mt-2">
//                   {el.title}
//                 </h4>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* OUR CATEGORY COLLECTION */}
      // <div className="my-1 w-full flex justify-center items-center h-screen">
      //   <div className="w-full">
      //     <h3 className="text-[32px] text-white font-playfair font-semibold py-[15px] ">
      //       OUR CATEGORY COLLECTION
      //     </h3>
      //     <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-5">
      //       {shuffledCategories?.map((el) => (
      //         <Link to={`/${el.title}`} key={el._id} className="w-full">
      //           <div className="rounded-[20px] overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:border-transparent">
      //             <img
      //               src={el.image}
      //               alt={el.title}
      //               className="w-full h-[200px] object-cover transition duration-300 ease-in-out hover:brightness-75"
      //             />
      //             <div className="p-4 bg-white hover:bg-main hover:text-white transition duration-300">
      //               <h4 className="text-lg font-semibold text-[#3e2723] hover:text-white">
      //                 {el.title}
      //               </h4>
      //             </div>
      //           </div>
      //         </Link>
      //       ))}
      //     </div>
      //   </div>
      // </div>

//       {/* BLOG Section */}
      // <div className="my-8  flex justify-center items-center h-screen">
      //   <div className="flex w-full mx-auto">
      //     <div className=" w-full">
      //       {randomBlog && (
      //         <div className="flex p-4">
      //           <img
      //             src={randomBlog.image}
      //             alt="Blog"
      //             className="w-[600px] h-[260px] object-cover rounded-md transition tranform duration-500 hover:scale-105"
      //           />
      //           <div className="flex flex-col mx-4 gap-3 justify-center">
      //             <div className="px-2 flex text-white space-x-2">
      //               <span className="text-[16px] font-light line-clamp-1">
      //                 {moment(randomBlog.createdAt).format("DD [Th]MM")}
      //               </span>
      //               <span className="mx-1 text-white">•</span>
      //               <span className="text-[16px] font-light uppercase line-clamp-1">
      //                 {randomBlog?.category?.title}
      //               </span>
      //             </div>
      //             <h4 className="text-[28px] px-2 font-semibold text-white uppercase">
      //               {randomBlog.title}
      //             </h4>
      //             <div
      //               className="px-2 text-[16px] font-light text-slate-300 line-clamp-3"
      //               dangerouslySetInnerHTML={{
      //                 __html: DOMPurify.sanitize(randomBlog?.description),
      //               }}
      //             />
      //             <Link
      //               to={`/${randomBlog._id}/${randomBlog.title.replace(
      //                 /\s+/g,
      //                 "-"
      //               )}`}
      //               className="text-white px-2 hover:text-[#cdefc9]"
      //             >
      //               [ ─── Read More]
      //             </Link>
      //           </div>
      //         </div>
      //       )}
      //     </div>

      //     <div></div>
      //   </div>

      //   <div className="flex w-full mx-auto">
      //     <div className=" w-full">
      //       <div className="flex p-4">
      //         <div className="w-full flex flex-col px-2 gap-2 justify-center">
               
      //           <span className="text-[75px] font-semibold text-[#d8f0d8] uppercase ">
      //             Blogs
      //           </span>
                
      //           <span className="text-slate-300 ">
      //           This is a space where you can stay updated on trends, share styles, gain valuable insights, and freely express your individuality in the fashion you love.
      //           </span>
      //           <div className="flex gap-4 my-4">
      //             <Link
      //               to={`/blogs`}
      //               className="text-main flex gap-2 justify-center py-3 px-3 bg-[#eef1ef] shadow-md rounded-[5px]
      //            hover:text-white hover:bg-main duration-300 hover:shadow-lg"
      //             >
      //               <span className="z-10">See All Post</span>
      //             </Link>

      //             <Link
      //               to={`/${path.MEMBER}/${path.M_BLOG}`}
      //               className="flex gap-2 justify-center py-3 px-3 text-main bg-[#eef1ef] shadow-md rounded-[5px] 
      //            relative overflow-hidden
      //            before:absolute before:inset-0 before:bg-gradient-to-l before:to-main before:from-[#d8ecdf] 
      //            before:translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-0
      //            hover:text-white hover:shadow-lg ease-in-out transform hover:scale-105"
      //             >
      //               <BsPatchPlus className="my-auto z-10" size={24} />
      //               <span className="z-10">Create Blog Post</span>
      //             </Link>
      //           </div>
      //         </div>
      //         <div className="w-full flex ml-4 relative">
      //           <img
      //             src={fb}
      //             alt="Blog"
      //             className="w-[600px] h-[260px] object-cover rounded-md shadow-lg transition tranform duration-500 hover:scale-105"
      //           />
                
      //         </div>
      //       </div>
      //     </div>

      //     <div></div>
      //   </div>
      //  </div>
//     </Slider>
//   );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import { Banner, BestSellers, NewArrival } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { fetchBrands } from "../../store/brand/AsyncAction";
import { Link, useSearchParams } from "react-router-dom";
import Slider from "react-slick";
import { apiGetAllBlog } from "../../apis";
import DOMPurify from "dompurify";
import moment from "moment";
import fb from "../../assets/fb.jpg";
import path from "../../ultils/path";
import star from "../../assets/star.png";
import { BsPatchPlus } from "react-icons/bs";


const Home = () => {
  // Cài đặt slider dọc cho các phần chính
const verticalSettings = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  vertical: true,
  verticalSwiping: true,
  beforeChange: (current, next) => setActiveSlide(next),
};

// Cài đặt slider ngang cho bộ sưu tập thương hiệu
const horizontalSettings = {
  dots: false,
  infinite: true,
  speed: 800,
  slidesToShow: 5,
  slidesToScroll: 1,
};

  const { categories } = useSelector((state) => state.app);
  const { brands } = useSelector((state) => state.brand);

  const dispatch = useDispatch();
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = React.useRef(null);
  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const shuffledCategories = categories
    ?.filter((el) => el?.title.length > 0)
    ?.sort(() => 0.5 - Math.random())
    ?.slice(0, 10);

  const randomBrands = brands
    ?.filter((el) => el?.title.length > 0)
    ?.sort(() => 0.5 - Math.random())
    ?.slice(0, 10);

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

  const randomBlog = blogs?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )?.[0];

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault(); 
      if (sliderRef.current) {
        if (event.deltaY > 0) {
          sliderRef.current.slickNext();
        } else {
          sliderRef.current.slickPrev();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  

  return (
    <Slider ref={sliderRef} {...verticalSettings} className="vertical-slider">
      
      {/* Banner Section */}
      <div
        className={`w-full flex justify-center items-center h-screen ${
          activeSlide === 0 ? "animate-fadeIn" : "opacity-0"
        }`}
      >
        <div className="flex flex-col w-full flex-auto ">
          <Banner />
        </div>
      </div>

      {/* Best Sellers Section */}
      <div
        className={`w-full flex justify-center items-center h-screen ${
          activeSlide === 1 ? "animate-fadeIn" : "opacity-0"
        }`}
      >
        <div className="flex flex-row w-full gap-4">
          <div className="w-full">
            <BestSellers />
            <div className="flex relative">
              <img
                src={star}
                alt="star"
                className="z-0 object-contain h-[500px] w-[500px] opacity-5 absolute -top-[60px] -right-[50px] animate-spin-slow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* New Arrival Section */}
      <div
        className={`w-full flex justify-center items-center h-screen ${
          activeSlide === 2 ? "animate-fadeIn" : "opacity-0"
        }`}
      >
        <div className="flex flex-row w-full gap-4">
          <div className="w-full">
            <NewArrival />
            <div className="flex relative">
              <img
                src={star}
                alt="star"
                className=" object-contain h-[500px] w-[500px] opacity-5 absolute bottom-[380px] -right-[50px] animate-spin-slow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Collection Section */}
      <div
        className={` w-full flex justify-center items-center h-screen px-6 ${
          activeSlide === 3 ? "animate-slideInRight" : "opacity-0"
        }`}
      >
        
         <div className="flex p-2 rounded-t-[17px] justify-center items-center">
          <div className="font-semibold uppercase text-white font-playfair text-[32px] text-center">
            Our brands collection
           </div>

          <div className="flex-1 border-b border-gray-300 mx-2"></div>
        </div>

        <div className="font-extralight text-[20px] text-white text-left p-2">
          <span>
            We are proud of products from reputable brands and of the highest
            quality. Which do you like?
           </span>
         </div>
         {/* Use a grid layout for brands */}
         <div className="brands-grid">
          {randomBrands?.map((el) => (
            <Link
              to={`/products?brand=${el.title}`}
              key={el._id}
              className="flex flex-col items-center"
            >
              <div className="bubble-effect">
                <img
                  src={el.image}
                  alt={el.title}
                  className="w-[145px] h-[145px] object-contain rounded-full border-2 border-[#7ca07a] bg-white"
                />
                <h4 className="font-semibold text-[16px] text-white uppercase text-center mt-2">
                  {el.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      
      </div>

      {/* Category Collection Section */}
      <div
        className={`my-1 w-full flex justify-center items-center h-screen ${
          activeSlide === 4 ? "animate-slideInLeft" : "opacity-0"
        }`}
      >
        
        <div className="w-full">
          <h3 className="text-[32px] text-white font-playfair font-semibold py-[15px] ">
            OUR CATEGORY COLLECTION
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-5">
            {shuffledCategories?.map((el) => (
              <Link to={`/${el.title}`} key={el._id} className="w-full">
                <div className="rounded-[20px] overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:border-transparent">
                  <img
                    src={el.image}
                    alt={el.title}
                    className="w-full h-[200px] object-cover transition duration-300 ease-in-out hover:brightness-75"
                  />
                  <div className="p-4 bg-white hover:bg-main hover:text-white transition duration-300">
                    <h4 className="text-lg font-semibold text-[#3e2723] hover:text-white">
                      {el.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      
      </div>

      {/* Blog Section */}
      <div
        className={`my-8 flex justify-center items-center h-screen ${
          activeSlide === 5 ? "animate-slideInUp" : "opacity-0"
        }`}
      >
       
        <div className="flex w-full mx-auto">
          <div className=" w-full">
            {randomBlog && (
              <div className="flex p-4">
                <img
                  src={randomBlog.image}
                  alt="Blog"
                  className="w-[600px] h-[260px] object-cover rounded-md transition tranform duration-500 hover:scale-105"
                />
                <div className="flex flex-col mx-4 gap-3 justify-center">
                  <div className="px-2 flex text-white space-x-2">
                    <span className="text-[16px] font-light line-clamp-1">
                      {moment(randomBlog.createdAt).format("DD [Th]MM")}
                    </span>
                    <span className="mx-1 text-white">•</span>
                    <span className="text-[16px] font-light uppercase line-clamp-1">
                      {randomBlog?.category?.title}
                    </span>
                  </div>
                  <h4 className="text-[28px] px-2 font-semibold text-white uppercase">
                    {randomBlog.title}
                  </h4>
                  <div
                    className="px-2 text-[16px] font-light text-slate-300 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(randomBlog?.description),
                    }}
                  />
                  <Link
                    to={`/${randomBlog._id}/${randomBlog.title.replace(
                      /\s+/g,
                      "-"
                    )}`}
                    className="text-white px-2 hover:text-[#cdefc9]"
                  >
                    [ ─── Read More]
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div></div>
        </div>

        <div className="flex w-full mx-auto">
          <div className=" w-full">
            <div className="flex p-4">
              <div className="w-full flex flex-col px-2 gap-2 justify-center">
               
                <span className="text-[75px] font-semibold text-[#d8f0d8] uppercase ">
                  Blogs
                </span>
                
                <span className="text-slate-300 ">
                This is a space where you can stay updated on trends, share styles, gain valuable insights, and freely express your individuality in the fashion you love.
                </span>
                <div className="flex gap-4 my-4">
                  <Link
                    to={`/blogs`}
                    className="text-main flex gap-2 justify-center py-3 px-3 bg-[#eef1ef] shadow-md rounded-[5px]
                 hover:text-white hover:bg-main duration-300 hover:shadow-lg"
                  >
                    <span className="z-10">See All Post</span>
                  </Link>

                  <Link
                    to={`/${path.MEMBER}/${path.M_BLOG}`}
                    className="flex gap-2 justify-center py-3 px-3 text-main bg-[#eef1ef] shadow-md rounded-[5px] 
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
              <div className="w-full flex ml-4 relative">
                <img
                  src={fb}
                  alt="Blog"
                  className="w-[600px] h-[260px] object-cover rounded-md shadow-lg transition tranform duration-500 hover:scale-105"
                />
                
              </div>
            </div>
          </div>

          <div></div>
        </div>
       
      </div>
    </Slider>
  );
};

export default Home;
