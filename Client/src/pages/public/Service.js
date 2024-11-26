import React from "react";

import shadow from "../../assets/Shadow.png";
import hb from "../../assets/handbag-illustration.png";
import sc from "../../assets/sunglasses-cool.png";
import ring from "../../assets/ring.png";
import wave from "../../assets/wave-1.png";

import { WiStars } from "react-icons/wi";
import MiniBanner from "../../components/MiniBanner";
import CountUp from "react-countup";

const Service = () => {
  return (
    <div className="flex flex-col px-8">
      <div className="flex w-full items-center">
        <span className="flex-1 mx-2 border-b-2 rounded-3xl border-[#d9e7dd] animate-slideInLeft"></span>
        <div className="text-center gradient-text animate-fadeIn">
          Vieen's Store
        </div>
        <span className="flex-1 mx-2 border-b-2 border-[#d9e7dd] animate-slideInRight"></span>
      </div>

      <div className="flex justify-between gap-8">
        {/* Text Section (60% width) */}
        <div className="w-[60%] relative flex flex-col animate-slideInLeft text-justify">
          <span className="art-word-shadow">Who We Are?</span>
          <span className="text-[16px]">
            Vieen's Store is a premier destination for fashion enthusiasts,
            offering a wide range of Fashion Accessories tailored to your style.
            Whether you're looking for specific brands or unique types of
            accessories, you'll find everything you need to Express Yourself .
            With that, you can become a Professional Fashion Blogger , sharing
            your fashion journey with the accessories you love!
          </span>

          <span className="art-word-shadow mt-2">Commitment</span>
          <span className="text-[16px] text-justify">
            Vieen's Store committed to product quality that will not disappoint
            our customers. Quality and price are the most important things to
            us, to give customers the best shopping and using experience.
          </span>
        </div>

        {/* Image Section (40% width) */}
        <div className="w-[40%] relative flex items-center">
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

      <div className="flex justify-center mb-4 animate-slideInUp">
        <div className="flex flex-col px-8 py-2 border-r-2 border-[#d9e7dd] items-center">
          <CountUp start={0} end={30} duration={1} suffix="+" 
            className="text-[80px] text-[#dcb04a] font-semibold" 
          />
          <span className="text-[24px] text-[#3B5442]">All Products</span>
        </div>

        <div className="flex flex-col px-8 py-2 border-r-2 border-[#d9e7dd] items-center">
        <CountUp start={0} end={100} duration={1} suffix="+" 
            className="text-[80px] text-[#dcb04a] font-semibold" 
          />
          <span className="text-[24px] text-[#3B5442]">Customers</span>
        </div>

        <div className="flex flex-col px-8 py-2 border-r-2 border-[#d9e7dd] items-center">
        <CountUp start={0} end={20} duration={1} suffix="+" 
            className="text-[80px] text-[#dcb04a] font-semibold" 
          />
          <span className="text-[24px] text-[#3B5442]">Brands</span>
        </div>

        <div className="flex flex-col px-8 py-2 border-r-2 border-[#d9e7dd] items-center">
        <CountUp start={0} end={10} duration={1} suffix="+" 
            className="text-[80px] text-[#dcb04a] font-semibold" 
          />
          <span className="text-[24px] text-[#3B5442]">Types Items</span>
        </div>

        <div className="flex flex-col px-8 py-2 items-center">
        <CountUp start={0} end={100} duration={1} suffix="+" 
            className="text-[80px] text-[#dcb04a] font-semibold" 
          />
          <span className="text-[24px] text-[#3B5442]">Orders Per Day</span>
        </div>
      </div>

      <div className="flex w-full flex-col mt-4 mb-4">
        <div className="flex w-full items-center">
          <span className="flex-1 mx-2 border-b-2 rounded-3xl border-[#d9e7dd]"></span>
          <span className="flex text-[32px] mx-auto font-semibold text-[#3B5442]">
            WE PROVIDE
          </span>
          <span className="flex-1 mx-2 border-b-2 rounded-3xl border-[#d9e7dd] animate-slideInLeft"></span>
        </div>
        <div className="flex justify-center">
          <MiniBanner />
        </div>
      </div>
    </div>
  );
};

export default Service;
