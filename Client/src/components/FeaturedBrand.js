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
import { GiCrownedHeart } from "react-icons/gi";

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

const FeaturedBrand = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const { categories } = useSelector((state) => state.app);

  const fetchProducts = async () => {
    try {
      const response = await apiGetProducts({
        brand: "cartier",
        sort: "-totalRatings",
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
    <div className="relative bg-main h-[650px] p-4 rounded-[30px]">
      <div className="flex rounded-t justify-center items-center">
        {/* <div className="flex-1 border-b border-gray-300 mx-2"></div> */}
        <div className="flex items-center gap-4 px-6 mt-2 font-semibold uppercase text-white text-[32px] text-center">
          <span>our featured brand</span>
          <span className="text-[40px] font-bold text-[#dcb04a]">Cartier</span>
        </div>
        <div className="flex-1 border-b border-gray-300 border-opacity-40  mx-2"></div>
      </div>

      <div className="font-extralight text-[20px] text-white ml-6">
        <span>
          These are Cartier products from our shop—diverse and exquisite to meet
          your desires
        </span>
      </div>

      <div className="absolute ml-[870px] top-[95px] -rotate-[8deg] opacity-50">
        <WiStars size={22} />
      </div>
      <div className="absolute ml-[880px] top-[65px] opacity-40">
        <GiCrownedHeart size={50} />
      </div>
      <div className="absolute ml-[920px] top-[65px] rotate-[8deg] opacity-45">
        <WiStars size={25} />
      </div>

      <div className=" grid grid-cols-4 gap-2 p-4">
        {bestSellers?.length > 0 ? (
          bestSellers.map((el, idx) => (
            <div key={idx} className="p-2 hover:scale-105 duration-500">
              <div className="">
                <CardProduct pid={el._id} productData={el} />
                <div className="flex flex-col mt-2 mx-auto text-center w-fit px-3 py-0.5 text-white text-md font-medium uppercase">
                  {el?.category || "No Category"}
                  <div className="flex-1 border-b border-gray-300 border-opacity-80"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-white">No Products Available</div>
        )}
      </div>
      {/* <div className="relative w-[320px] flex-1 ml-[830px] -mt-[10px] border-b border-gray-300 border-opacity-40 mx-2"></div>
      <WiStars
        size={50}
        color="#dcb04a"
        className="absolute flex ml-[1080px] -mt-[50px] opacity-80"
      /> */}
      <div className="-mt-[12px] flex justify-center text-[#dcb04a] text-opacity-85 hover:text-[#D8F0D8]">
        <Link
          to={`/products?brand=Cartier`}
          className="flex items-center gap-2"
        >
          <MdKeyboardDoubleArrowLeft className="opacity-40" />
          <span className="hover:scale-105 ">Explore More Now</span>
          <MdKeyboardDoubleArrowRight className="opacity-40" />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedBrand;
