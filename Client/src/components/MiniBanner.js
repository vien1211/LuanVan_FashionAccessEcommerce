import React from "react";
import { Link } from "react-router-dom";
import icons from "../ultils/icons";
import bysomething_MiniBanner from "../assets/bysomething_MiniBanner.png";
import bulgari from "../assets/bulgari.png";
import chanel from "../assets/Chanel-Logo.png";
import clk from "../assets/calvin-klein.png";
import bagck from "../assets/bagck.png";
import blog from "../assets/blog.png";
import WCart from "../assets/Woman in shopping cart.png";
import bag from "../assets/bagvoucher.png";
import bgv from "../assets/bgv.jpg";
import { WiStars } from "react-icons/wi";

const { BsStars } = icons;

const MiniBanner = () => {
  return (
    <div className=" w-full py-4">
      <div className="flex gap-5 h-[220px]">
        {/* varity fa Banner */}
        <div className="w-[33%] bg-[#3f915e] flex items-center justify-center relative transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#3c5446] hover:via-[#2b5e3e] hover:to-main">
          <Link
            to="/products"
            className="relative flex items-center transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <div className="relative flex flex-col text-[30px] text-white gap-1 items-center p-3 hover:text-[#f9e366] z-10">
              <span className="font-bold text-[20px] uppercase">
                Variety Of
              </span>
              <span className="font-bold text-[28px] uppercase">
                Fashion Accessories
              </span>
              <span className="font-thin text-[15px] bg-[#5a8d6d] px-2 rounded-lg">
                Buy something now
              </span>
            </div>

            <span className="absolute flex right-[45px] transform opacity-15">
              <img
                src={bysomething_MiniBanner}
                alt="Banner"
                className="w-[250px]"
              />
            </span>
          </Link>
        </div>

        {/* TOP GLOBAL BRANDS Banner */}
        <div className="relative w-[33%] bg-[#6b9db1] flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#36688d] hover:via-[#2d82a3] hover:to-[#144d64]">
          <Link
            to="/products?brand=Cartier"
            className="relative flex items-center justify-center transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <div className="relative flex flex-col font-bold text-[26px] text-white gap-0 items-center justify-center p-5 hover:text-[#f18904] z-10">
              <span className="font-bold text-[28px]">TOP GLOBAL</span>
              <span className="font-bold text-[65px]">BRANDS</span>
              <span className="font-thin text-[15px] bg-[#365c6c] px-2 rounded-lg">
                Click to explore
              </span>
            </div>

            {/* Logo images */}
            <span className="absolute right-[-20px] flex transform rotate-[-30deg] opacity-10">
              <img src={bulgari} alt="Banner" className="w-[100px]" />
            </span>

            <span className="absolute left-[-30px] w-[150px] flex transform rotate-[-15deg] opacity-10">
              <img src={chanel} alt="Banner" className="w-[85px]" />
            </span>

            <span className="absolute top-[55px] flex transform rotate-[-15deg] opacity-10">
              <img src={clk} alt="Banner" className="w-[100px]" />
            </span>
          </Link>
        </div>

        {/* Blog Banner */}
        <div className="relative w-[33%] bg-[#c0623a] flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#ce7f4e] hover:via-[#be562a] hover:to-[#a94f28]">
          <Link
            to="/blogs"
            className="relative flex items-center justify-center transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <div className="relative flex flex-col font-bold text-white gap-0 items-center justify-center p-5 hover:text-[#eedb85] z-10">
              <span className="font-bold text-[65px]">BLOGS</span>
              <span className="font-light text-[14px]">
                Sharing Your Fashion Journey
              </span>
              <span className="font-thin mt-2 text-[15px] bg-[#c68e77] px-2 rounded-lg">
                Try out
              </span>
            </div>

            {/* Logo images */}
            <span className="absolute flex transform opacity-10">
              <img src={blog} alt="Banner" className="w-full" />
            </span>
          </Link>
        </div>
      </div>

      <div className="flex gap-5 h-[230px] mt-5">
        {/* YOUR love Banner */}
        <div className="w-[50%] bg-[#c03a4c] flex items-center justify-center relative transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#ab535f] hover:via-[#c93c4f] hover:to-[#d66b79]">
          <div
            className="flex items-center justify-center transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <span className="absolute top-6 left-[85px] text-white rotate-[-4deg]">
              <BsStars size={28} />
            </span>
            <img
              src={bagck}
              alt="bagck"
              className="object-contain h-[220px] w-[280px] -ml-[120px]"
              style={{ transform: "translateX(10%)" }}
            />
            <span className="relative flex flex-col font-bold text-[32px] text-white gap-1 items-center hover:text-[#eedb85] z-10">
              YOUR LOVE PIECES
              <span className="font-bold text-[36px] border-t border-b mt-2 hover:border-[#eedb85]">
                BUY NOW
              </span>
            </span>
            <span className="absolute bottom-7 -right-6 text-white rotate-[-15deg] opacity-85">
              <WiStars size={52} />
            </span>

            <span className="absolute flex transform opacity-15">
              <img
                src={WCart}
                alt="Banner"
                className="w-[270px] h-[270px] ml-[105px]"
              />
            </span>
          </div>
        </div>

        {/* SUPER SALE Banner */}
        <div className="w-[50%] bg-[#a89058] flex items-center justify-center relative transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#96835b] hover:via-[#927124] hover:to-[#8e6b1e]">
          <div
            className="flex items-center justify-center transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <div className="flex w-[510px] gap-4 text-[30px] text-white items-center justify-center hover:text-[#e8c5b2]">
              <div className="flex w-[70%] font-bold border-2 border-[#d0bb8a] p-5">
                <div className="flex flex-col">
                  <span className="font-bold text-[40px] text-center">
                    GIFT VOUCHER
                  </span>
                  <span className="font-light text-[15px] text-justify">
                    Present this gift voucher upon payment and enjoy discount on
                    any items.
                  </span>
                  <span className="font-thin text-center text-[16px] mt-2 uppercase">
                    Vieen's Store
                  </span>
                </div>
              </div>

              <div className="flex flex-col w-[30%] h-[178px] justify-center items-center font-bold border-2  border-[#d0bb8a]">
                <div className="flex flex-col">
                  <img
                    src={bag}
                    alt="bag"
                    className="object-contain h-[120px] w-[180px] ml-[-12px]"
                    style={{ transform: "translateX(10%)" }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[28px]">__% OFF</span>
                  {/* <span className="font-thin text-[40px]">OFF</span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniBanner;
