import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis/product";
import CardProduct from "./CardProduct";
import Slider from "react-slick";
import star from "../assets/star.png";
import { Link } from "react-router-dom";
import icons from "../ultils/icons";
import { useSelector } from "react-redux";
import shadow from "../assets/Shadow.png";
import { WiStars } from "react-icons/wi";

const { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } = icons;

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,

  // responsive: [
  //     {
  //         breakpoint: 1024,
  //         settings: {
  //             slidesToShow: 2,
  //             slidesToScroll: 1,
  //         }
  //     },
  //     {
  //         breakpoint: 600,
  //         settings: {
  //             slidesToShow: 1,
  //             slidesToScroll: 1,
  //         }
  //     }
  // ]
};

const CateProduct = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const { categories } = useSelector((state) => state.app);

  const fetchProducts = async () => {
    try {
      const response = await apiGetProducts({
        category: "watch",
        sort: "-sold",
        limit: "4",
      });
      if (response?.success) setBestSellers(response.productData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className=" bg-main h-[650px] p-4 rounded-[30px]">
      <div className="flex rounded-t justify-center items-center">
        {/* <div className="flex-1 border-b border-gray-300 mx-2"></div> */}
        <div className="flex items-center gap-4 px-6 py-2 font-semibold uppercase text-white text-[32px] text-center">
          <span className="text-[40px] font-bold text-[#dcb04a]">Watches</span>
          <span>you may like</span>
        </div>
        <div className="flex-1 border-b border-gray-300 border-opacity-40  mx-2"></div>
      </div>

      <div className="font-extralight text-[20px] text-white pb-2 ml-8">
        <span>
          Choose the watch that suits you best and let it reflect your unique
          style.
        </span>
      </div>

      <div className="relative grid grid-cols-4 gap-2 p-4">
        {bestSellers?.length > 0 ? (
          bestSellers.map((el, idx) => (
            <div
              key={idx}
              className={`p-2 hover:scale-105 duration-500 ${
                idx === 1
                  ? "mt-[20px]"
                  : idx === 2
                  ? "-mt-[15px]"
                  : idx === 3
                  ? "-mt-[45px]"
                  : ""
              }`}
            >
              <div className=" animate-bounce2">
                <CardProduct pid={el._id} productData={el} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-white">No Products Available</div>
        )}
      </div>
      <div className=" w-[320px] flex-1 ml-[830px] border-b border-gray-300 border-opacity-40 mx-2"></div>
      <WiStars
        size={50}
        color="#dcb04a"
        className="absolute flex ml-[1080px] -mt-[50px] opacity-80"
      />
      <div className="absolute ml-[870px] -mt-[35px] text-[18px]  text-[#dcb04a] text-opacity-85 ">
        <Link to={`/watch`} className="flex items-center gap-2 ">
          <MdKeyboardDoubleArrowLeft />
          <span className="">Explore More Now</span>
          <MdKeyboardDoubleArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default CateProduct;
