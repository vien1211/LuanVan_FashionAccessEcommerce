import React from "react";

import shadow from "../../assets/Shadow.png";
import hb from "../../assets/handbag-illustration.png";
import sc from "../../assets/sunglasses-cool.png";
import ring from "../../assets/ring.png";
import wave from "../../assets/wave-1.png";

import { WiStars } from "react-icons/wi";

const Service = () => {
  return (
    <div className="flex flex-col shadow-xl py-4 px-8 rounded-[20px] border mb-4">
      <div className="text-center gradient-text animate-fadeIn">
        Vieen's Store
      </div>

      <div className="flex justify-between gap-4">
        {/* Text Section (60% width) */}
        <div className="w-[60%] relative flex flex-col animate-slideInLeft text-justify">
          <span className="art-word-shadow">Who We Are?</span>
          <span>
            <span className="gradient-text-logo mr-2">Vieen's Store</span>
            <span className="text-[22px] font-light text-slate-600">
              is a premier{" "}
              <span className="font-semibold text-main">
                Ecommerce Destination
              </span>{" "}
              for fashion enthusiasts, offering a wide range of{" "}
              <span className="font-semibold text-main">
                Fashion Accessories{" "}
              </span>{" "}
              tailored to your style. Whether you're looking for specific brands
              or unique types of accessories, you'll find everything you need to{" "}
              <span className="font-semibold text-main">Express Yourself </span>
              . With that, you can become a{" "}
              <span className="font-semibold text-main">
                Professional Fashion Blogger
              </span>{" "}
              , sharing your fashion journey with the accessories you love!
            </span>
          </span>
        </div>

        {/* Image Section (40% width) */}
        <div className="w-[40%] relative flex items-center justify-center">
          {/* Background shadow */}
          <img
            src={shadow}
            alt="shadow"
            className="object-contain max-w-full max-h-full"
          />

          {/* Handbag Image */}
          <img
            src={hb}
            alt="handbag"
            className="object-contain w-[385px] absolute bottom-2 left-0 z-10 animate-slideInUp"
          />

          {/* Sunglass Image */}
          <img
            src={sc}
            alt="sunglass"
            className="object-contain w-[180px] absolute top-0 right-16 animate-slideInRight"
          />

          {/* Ring Image */}
          <img
            src={ring}
            alt="ring"
            className="object-contain w-[150px] absolute bottom-6 right-6 rotate-[4deg] z-10 animate-slideInRight"
          />
          <img
            src={wave}
            alt="wave"
            className="object-contain w-[150px] absolute top-18 -left-5 rotate-[65deg] opacity-55 animate-fadeIn"
          />

          <span className="absolute opacity-55 top-16 left-14 text-main rotate-[4deg] animate-slideInLeft">
            <WiStars size={48} />
          </span>

          <span className="absolute opacity-65 top-18 right-16 text-[#3B5442] rotate-[4deg] animate-slideInRight">
            <WiStars size={55} />
          </span>

          <img
            src={wave}
            alt="wave"
            className="object-contain w-[150px] absolute bottom-6 right-10 rotate-[16deg] opacity-35 animate-fadeIn"
          />
        </div>
      </div>
    </div>
  );
};

export default Service;
