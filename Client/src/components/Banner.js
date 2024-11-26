// import React from "react";
// import { Link } from "react-router-dom";
// import icons from "../ultils/icons";
// import ItemBanner from "../assets/Item Banner.png";
// import Typewriter from "typewriter-effect";

// const { FaArrowRightLong } = icons;
// const Banner = () => {
//   return (
//     <div className="flex w-full">
//     <div className="flex w-full h-[650px] bg-main text-white rounded-[30px]">
//       <div className="rounded-[30px] flex flex-col justify-center w-[40%] bg-[#6D8777] pl-16">
//         <h1 className="font-bold text-[100px]">2024</h1>
//         <h1 className="font-bold text-[40px]">YOUR CHOICE</h1>
//         <h1 className="font-semibold text-[40px] uppercase">Unleash Your Style</h1>
        
//         <div className="font-thin text-[24px]">
//           <Typewriter
//             options={{
//               strings: [
//                 "You would like to find the fashion accessories to elevate your life, come with me and let your personality shine.",
//               ],
//               autoStart: true,
//               loop: true,
              
//             }}
//           />
//         </div>

//         <button className="text-[24px] w-[220px] h-[50px] font-bold px-4 py-1 mt-8 bg-[#273526] text-white border-2 border-[#273526] transition-colors duration-300 ease-in-out hover:bg-white hover:text-[#273526]">
//           <Link to="/products" className="flex items-center">
//             <FaArrowRightLong className="text-[20px] mr-3 ml-4" />
//             <span className="text-[20px]">SHOP NOW</span>
//           </Link>
//         </button>
//       </div>
//       <div className=" w-[60%] relative">
//         <img
//           src={ItemBanner}
//           alt="Banner"
//           className=" object-cover h-full w-full transition-transform duration-700 ease-in-out transform-gpu absolute right-14  items-center"
//           style={{ transform: "translateX(10%)" }}
//           onMouseEnter={(e) =>
//             (e.currentTarget.style.transform =
//               "translateY(10%) rotate(-4deg) scale(1.25)")
//           }
//           onMouseLeave={(e) =>
//             (e.currentTarget.style.transform =
//               "translateX(10%) rotate(0deg) scale(1)")
//           }
//         />
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Banner;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import icons from "../ultils/icons";
import ItemBanner from "../assets/Item Banner.png";
import Typewriter from "typewriter-effect";
import b02 from "../assets/b02.png";
import w01 from "../assets/w01.png";
import shadow from "../assets/Shadow.png";
import w02 from "../assets/w02.png";
import { BsStars } from "react-icons/bs";
import { WiStars } from "react-icons/wi";

const { FaArrowRightLong } = icons;

const Banner = () => {
  const [show, setShow] = useState(false);

  // useEffect(() => {
  //   // Đặt timeout để hiển thị banner sau khi component mount
  //   const timer = setTimeout(() => {
  //     setShow(true);
  //   }, 100); // Thay đổi thời gian nếu cần

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="flex w-full">
      
      <div
        className={`flex w-full h-[650px] bg-main text-white rounded-[30px] transition-opacity duration-700`}
      >
        
        <div className=" relative rounded-[30px] flex flex-col justify-center w-[40%] bg-[#6D8777] pl-14">
            <img
            src={b02}
            alt="Banner"
            className="object-contain absolute h-[200px] w-[200px] opacity-5 transform top-3 left-2 z-0 rotate-[-10deg]"
          />
          <img
            src={w02}
            alt="Banner"
            className="object-contain absolute h-[170px] w-[170px] opacity-10 transform top-[120px] right-1 z-0 rotate-[10deg]"
          />



          
          <h1 className="font-bold text-[85px] animate-slideInLeft">2024</h1>
          <h1 className="font-bold text-[40px] animate-slideInLeft">YOUR CHOICE</h1>
          <h1 className="font-bold text-[40px] uppercase animate-slideInLeft">Unleash Your Style</h1>
          
          <div className="font-thin text-[24px] animate-slideInUp">
            <Typewriter
              options={{
                strings: [
                  "You would like to find the fashion accessories to elevate your life, come with me and let your personality shine.",
                ],
                autoStart: true,
                loop: true,
                delay: 50
              }}
            />
          </div>

          <button className="text-[24px] w-[220px] h-[50px] rounded-full font-bold px-4 py-1 mt-8 bg-[#273526] text-white border-2 border-[#273526] transition-colors duration-300 ease-in-out hover:bg-white hover:text-[#273526] animate-slideInUp">
            <Link to="/products" className="flex items-center">
              <FaArrowRightLong className="text-[20px] mr-3 ml-4" />
              <span className="text-[20px]">SHOP NOW</span>
            </Link>
          </button>
          
        </div>
        <div className="w-[60%] relative animate-slideInRight">
          <img
            src={ItemBanner}
            alt="Banner"
            className="object-cover h-full w-full transition-transform duration-700 ease-in-out transform-gpu absolute right-14 items-center"
            style={{ transform: "translateX(10%)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform =
                "translateY(10%) rotate(-4deg) scale(1.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform =
                "translateX(10%) rotate(0deg) scale(1)")
            }
          />
          
          
          <span className="absolute opacity-25 bottom-10 right-8 text-white rotate-[4deg]">
              <BsStars size={68} />
            </span>

            <span className="absolute opacity-15 bottom-10 right-20 mr-2 text-white rotate-[-14deg]">
              <BsStars size={30} />
            </span>
            
            <span className="absolute opacity-10 top-[70px] left-[170px] text-white rotate-[-4deg]">
              <BsStars size={44} />
            </span>

            
        </div>
      </div>
    </div>
  );
};

export default Banner;
