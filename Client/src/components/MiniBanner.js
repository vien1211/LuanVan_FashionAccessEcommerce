import React from "react";
import { Link } from "react-router-dom";
import icons from "../ultils/icons";
import bysomething_MiniBanner from "../assets/bysomething_MiniBanner.png";
import bulgari from "../assets/bulgari.png";
import chanel from "../assets/Chanel-Logo.png";
import clk from "../assets/calvin-klein.png";
import bagck from "../assets/bagck.png";

const { BsStars } = icons;

const MiniBanner = () => {
  return (
    <div className="mt-2">
      <div className="flex px-5 gap-5 h-[180px]">
        {/* SUPER SALE Banner */}
        <div className="w-[50%] bg-[#3f915e] flex items-center justify-center relative transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#3c5446] hover:via-[#2b5e3e] hover:to-main">
          <Link
            to="/sale"
            className="flex items-center justify-center transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <span className="flex flex-col font-bold border border-[#ffffff] text-[30px] text-white gap-1 items-center justify-center p-3 hover:text-[#f9e366]">
              SUPER SALE
              <span className="font-thin text-[16px] border-b hover:border-[#ffd700]">
                Buy something now
              </span>
            </span>
            <img
              src={bysomething_MiniBanner}
              alt="Banner"
              className="object-contain h-[170px] w-[170px] transition-transform duration-700 ease-in-out transform-gpu hover:scale-110"
              style={{ transform: "translateX(10%)" }}
            />
          </Link>
        </div>

        {/* TOP GLOBAL BRANDS Banner */}
        <div className="relative w-[50%] bg-[#6b9db1] flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#36688d] hover:via-[#2d82a3] hover:to-[#144d64]">
          <Link
            to="/sale"
            className="relative flex items-center justify-center transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <span className="relative flex flex-col font-bold text-[26px] text-white gap-0 items-center justify-center p-5 hover:text-[#f18904] z-10">
              TOP GLOBAL
              <span className="font-bold text-[48px]">BRANDS</span>
              <span className="font-thin text-[16px] border-b hover:border-[#f18904]">
                Click to explore
              </span>
            </span>

            {/* Logo images */}
            <span className="absolute right-[-80px] flex transform rotate-[-30deg] opacity-10">
              <img
                src={bulgari}
                alt="Banner"
                className="w-[100px]"
              />
            </span>

            <span className="absolute left-[-80px] w-[150px] flex transform rotate-[-15deg] opacity-10">
              <img
                src={chanel}
                alt="Banner"
                className="w-[85px]"
              />
            </span>

            <span className="absolute top-[50px] flex transform rotate-[-15deg] opacity-10">
              <img
                src={clk}
                alt="Banner"
                className="w-[100px]"
              />
            </span>
          </Link>
        </div>
      </div>

      <div className="flex px-5 gap-5 h-[180px] mt-5">
        {/* YOUR HAND BAG Banner */}
        <div className="w-[50%] bg-[#c0623a] flex items-center justify-center relative transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#ce7f4e] hover:via-[#be562a] hover:to-[#a94f28]">
          <Link
            to="/sale"
            className="flex items-center justify-center transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <span className="absolute top-6 left-4 text-white rotate-[-8deg]">
              <BsStars size={28} />
            </span>
            <img
              src={bagck}
              alt="bagck"
              className="object-contain h-[180px] w-[180px] -ml-8"
              style={{ transform: "translateX(10%)" }}
            />
            <span className="flex flex-col font-bold text-[24px] text-white gap-1 items-center justify-center hover:text-[#eedb85]">
              YOUR HAND BAG
              <span className="font-bold text-[36px] border-t border-b mt-2 hover:border-[#eedb85]">
                BUY NOW
              </span>
            </span>
            <span className="absolute bottom-7 -right-6 text-white rotate-[-15deg]">
              <BsStars size={42} />
            </span>
          </Link>
        </div>

        {/* SUPER SALE Banner */}
        <div className="w-[50%] bg-[#3f915e] flex items-center justify-center relative transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#3c5446] hover:via-[#2b5e3e] hover:to-main">
          <Link
            to="/sale"
            className="flex items-center justify-center transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <span className="flex flex-col font-bold border border-[#ffffff] text-[30px] text-white gap-1 items-center justify-center p-5 hover:text-[#f9e366]">
              SUPER SALE
              <span className="font-thin text-[16px] border-b hover:border-[#ffd700]">
                Buy something now
              </span>
            </span>
            <img
              src={bysomething_MiniBanner}
              alt="Banner"
              className="object-contain h-[170px] w-[170px] transition-transform duration-700 ease-in-out transform-gpu hover:scale-110"
              style={{ transform: "translateX(10%)" }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MiniBanner;
