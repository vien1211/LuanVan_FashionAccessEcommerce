import React, { useEffect, useState } from "react";
import {
  Banner,
  BestSellers,
  CateProduct,
  FeaturedBrand,
  NewArrival,
} from "../../components";
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
import shadow from "../../assets/Shadow.png";
import G51 from "../../assets/Group 51.png";
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

  const settings = {
    dots: true, // Hiển thị chấm tròn điều hướng
    infinite: true, // Vòng lặp vô hạn
    speed: 500, // Tốc độ chuyển đổi
    slidesToShow: 1, // Số slide hiển thị tại 1 thời điểm
    slidesToScroll: 1, // Số slide chuyển đổi mỗi lần
    autoplay: true, // Tự động chạy
    autoplaySpeed: 5000, // Thời gian giữa các slide
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
    ?.slice(0, 4);
  const displayedCategories = shuffledCategories?.slice(0, 4);

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
        className={` w-full flex justify-center items-center h-screen ${
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
          activeSlide === 2 ? "animate-slideInRight" : "opacity-0"
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

      {/* Watch Section */}
      <div
        className={` w-full flex justify-center items-center h-screen ${
          activeSlide === 3 ? "animate-slideInUp" : "opacity-0"
        }`}
      >
        <div className="flex flex-row w-full gap-4">
          <div className="w-full">
            <CateProduct />
            {/* <div className="flex relative">
              <img
                src={star}
                alt="star"
                className=" object-contain h-[100px] w-[100px] absolute bottom-[500px] right-[380px] opacity-15 animate-spin-slow"
              />
            </div> */}
          </div>
        </div>
      </div>

      {/* Category Collection Section */}
      <div
        className={`my-1 relative w-full flex justify-center items-center h-screen ${
          activeSlide === 4 ? "animate-slideInUp" : "opacity-0"
        }`}
      >
        <div className="w-full">
          <div className="flex p-2 rounded-t-[17px] justify-center items-center">
            <div className="font-semibold uppercase text-white font-playfair text-[32px] text-center">
              Our categories collection
            </div>

            <div className="flex-1 border-b border-gray-300 mx-2"></div>
          </div>
          <div className="w-[535px] font-extralight text-[20px] text-white text-left p-2">
            <span>
              We offer a wide variety of products, carefully curated to suit
              every preference and need.
            </span>
          </div>

          <div className="flex gap-6 p-5">
            {displayedCategories?.map((el, index) => (
              <Link
                to={`/${el.title}`}
                key={el._id}
                className={`w-[300px] h-[325px] relative z-10 ${
                  index === 1
                    ? "mt-[80px]"
                    : index === 2
                    ? "-mt-10"
                    : index === 3
                    ? "-mt-[85px]"
                    : ""
                }`}
              >
                <div className="animate-bounce2 rounded-[30px] overflow-hidden shadow-lg shadow-[#7CA07A] transition duration-1000 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-[#d4e8d4] hover:border-transparent">
                  <img
                    src={el.image}
                    alt={el.title}
                    className="w-[300px] h-[320px] object-cover transition duration-300 ease-in-out hover:brightness-75"
                  />
                  <div className="p-4 bg-white  transition duration-300">
                    <h4 className="text-lg font-normal text-main">
                      {el.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex-1 w-[250px]  border-b border-gray-300 mx-8 -mt-4"></div>
          <div className="flex justify-end w-full pr-10 -mt-8 font-extralight text-white text-[20px]">
            <span>
              Enjoy the freedom of choice and shop with confidence,<br></br> as
              we have gathered the best products just for you.
            </span>
          </div>
          <div className="flex-1 w-[560px] pr-10 justify-end border-b border-gray-300 mx-[620px] mt-6"></div>

          <img
            src={shadow}
            alt="shadow"
            className="animate-spin object-contain h-[600px] w-[695px] absolute -left-[60px] top-[290px] opacity-80"
          />

          <img
            src={shadow}
            alt="shadow"
            className="animate-spin object-contain h-[600px] w-[695px] absolute -right-[120px] bottom-[400px]"
          />

          <img
            src={shadow}
            alt="shadow"
            className=" object-contain h-[400px] w-[495px] absolute left-[280px] top-[80px] opacity-50"
          />
        </div>
      </div>

      {/* Featured Brand Section */}
      <div
        className={` w-full flex justify-center items-center h-screen ${
          activeSlide === 5 ? "animate-slideInUp" : "opacity-0"
        }`}
      >
        <div className="flex flex-row w-full gap-4">
          <div className="w-full">
            <FeaturedBrand />
            {/* <div className="flex relative">
              <img
                src={star}
                alt="star"
                className=" object-contain h-[100px] w-[100px] absolute bottom-[500px] right-[380px] opacity-15 animate-spin-slow"
              />
            </div> */}
          </div>
        </div>
      </div>

      {/* Brand Collection Section */}
      <div
        className={`-my-4 w-full flex justify-center items-center h-screen px-6 ${
          activeSlide === 6 ? "animate-slideInRight" : "opacity-0"
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
              // onMouseEnter={() => handleMouseEnter(el.image)}
              // onMouseLeave={handleMouseLeave}
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
      {/* <div
        className={`my-1 relative w-full flex justify-center items-center h-screen ${
          activeSlide === 6 ? "animate-slideInUp" : "opacity-0"
        }`}
      >
        <div className="w-full">
          <div className="flex p-2 rounded-t-[17px] justify-center items-center">
            <div className="font-semibold uppercase text-white font-playfair text-[32px] text-center">
              Our categories collection
            </div>

            <div className="flex-1 border-b border-gray-300 mx-2"></div>
          </div>
          <div className="w-[535px] font-extralight text-[20px] text-white text-left p-2">
            <span>
              We offer a wide variety of products, carefully curated to suit
              every preference and need.
            </span>
          </div>

          <div className="flex gap-6 p-5">
            {displayedCategories?.map((el, index) => (
              <Link
                to={`/${el.title}`}
                key={el._id}
                className={`w-[300px] h-[325px] relative z-10 ${
                  index === 1
                    ? "mt-[80px]"
                    : index === 2
                    ? "-mt-10"
                    : index === 3
                    ? "-mt-[85px]"
                    : ""
                }`}
              >
                <div className="animate-bounce2 rounded-[30px] overflow-hidden shadow-lg shadow-[#7CA07A] transition duration-1000 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-[#d4e8d4] hover:border-transparent">
                  <img
                    src={el.image}
                    alt={el.title}
                    className="w-[300px] h-[320px] object-cover transition duration-300 ease-in-out hover:brightness-75"
                  />
                  <div className="p-4 bg-white  transition duration-300">
                    <h4 className="text-lg font-normal text-main">
                      {el.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex-1 w-[250px]  border-b border-gray-300 mx-8 -mt-4"></div>
          <div className="flex justify-end w-full pr-10 -mt-8 font-extralight text-white text-[20px]">
            <span>
              Enjoy the freedom of choice and shop with confidence,<br></br> as
              we have gathered the best products just for you.
            </span>
          </div>
          <div className="flex-1 w-[560px] pr-10 justify-end border-b border-gray-300 mx-[620px] mt-6"></div>

          <img
            src={shadow}
            alt="shadow"
            className="animate-spin object-contain h-[600px] w-[695px] absolute -left-[60px] top-[290px] opacity-80"
          />

          <img
            src={shadow}
            alt="shadow"
            className="animate-spin object-contain h-[600px] w-[695px] absolute -right-[120px] bottom-[400px]"
          />

          <img
            src={shadow}
            alt="shadow"
            className=" object-contain h-[400px] w-[495px] absolute left-[280px] top-[80px] opacity-50"
          />
        </div>
      </div> */}

      {/* Blog Section */}
      <div
        className={`my-8 flex justify-center items-center h-screen ${
          activeSlide === 7 ? "animate-slideInUp" : "opacity-0"
        }`}
      >
        <div className="flex w-full mx-auto">
          <div className=" w-full">
            {randomBlog && (
              <div className="flex p-4">
                <img
                  src={randomBlog.image}
                  alt="Blog"
                  className="w-[600px] h-[280px] object-cover rounded-[20px] transition tranform duration-500 hover:scale-105"
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
                  This is a space where you can stay updated on trends, share
                  styles, gain valuable insights, and freely express your
                  individuality in the fashion you love.
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
                  className="w-[600px] h-[280px] object-cover rounded-[20px] shadow-lg transition tranform duration-500 hover:scale-105"
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
