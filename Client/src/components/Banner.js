import React from "react";
import { Link } from "react-router-dom";
import icons from "../ultils/icons";
import ItemBanner from "../assets/Item Banner.png";

const { FaArrowRightLong } = icons;
const Banner = () => {
  return (
    <div className="flex w-full h-[450px] bg-main text-white rounded-[30px]">
      <div className="rounded-[30px] flex flex-col justify-center w-[40%] bg-[#6D8777] pl-16">
        <h1 className="font-bold text-[80px] mt-[-20px]">2024</h1>
        <h1 className="font-semibold text-[35px]">BEST FASHION</h1>
        <h1 className="font-bold text-[42px]">YOUR CHOICE</h1>
        <p className="font-thin text-[18px] ">
          You would like to find the fashion accessories to make your style,
          come with me and do it.
        </p>

        <button className="text-[24px] w-[200px] h-[40px] font-bold px-4 py-1 mt-3 bg-[#273526] text-white border-2 border-[#273526] transition-colors duration-300 ease-in-out hover:bg-white hover:text-[#273526]">
          <Link to="/products" className="flex items-center">
            <FaArrowRightLong className="text-[16px] mr-3 ml-3" />
            <span className="text-[16px]">SHOP NOW</span>
          </Link>
        </button>
      </div>
      <div className="w-[60%] relative">
        <img
          src={ItemBanner}
          alt="Banner"
          className="object-cover h-full w-full transition-transform duration-700 ease-in-out transform-gpu absolute right-14 -top-3 items-center"
          style={{ transform: "translateX(10%)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform =
              "translateX(15%) rotate(-4deg) scale(1.25)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform =
              "translateX(10%) rotate(0deg) scale(1)")
          }
        />
      </div>
    </div>
  );
};

export default Banner;
