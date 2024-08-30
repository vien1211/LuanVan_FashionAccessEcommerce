import React, { memo } from "react";
import icons from "../ultils/icons";

const { HiPhone, IoMdMail, FaLocationDot} = icons;
const Footer = () => {
  return (
    <div className="w-full">
      <div className="h-[350px] w-full bg-main flex items-center justify-center text-white text-[15px]">
        <div className="w-main flex">
          {/* About Us Section */}
          <div className="flex-2 flex flex-col gap-2 mr-[80px]">
            <h3 className="mb-[20px] font-medium text-[20px] pl-[15px] border-l-4 border-[#273526]">
              CONTACT US
            </h3>
            <div className='flex gap-2'>
                <FaLocationDot size={16}/>
              <span>Address: </span>
              <span className="opacity-70">
                Dinh Mon, Thoi Lai District, Can Tho City, Vietnam
              </span>
            </div>
            <div className='flex gap-2'>
                <HiPhone size={16}/>
              <span>Phone: </span>
              <span className="opacity-70">(+84) 776 812 012</span>
            </div>
            <div className='flex gap-2'>
                <IoMdMail size={16}/>
              <span>Mail: </span>
              <span className="opacity-70">vienstore@gmail.com</span>
            </div>

            <h3 className="mb-[20px] font-bold text-[40px] mt-2">
              VIEEN'S STORE
            </h3>
          </div>

          {/* Information Section */}
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] font-medium text-[20px] pl-[15px] border-l-4 border-[#273526]">
              INFORMATION
            </h3>
            <span>About Us</span>
            <span>Purchase Policy</span>
            <span>Payment Policy</span>
            <span>Return Policy</span>
            <span>FAQs</span>
          </div>

          {/* Placeholder Sections */}
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] font-medium text-[20px] pl-[15px] border-l-4 border-[#273526]">
              QUICK LINKS
            </h3>
            <span>Shop Now</span>
            <span>Sign In</span>
            <span>Sign Up</span>
            <span>Our Categories</span>
            <span>Contact Us</span>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] font-medium text-[20px] pl-[15px] border-l-4 border-[#273526]">
              INFORMATION
            </h3>
            <span>Link 1</span>
            <span>Link 2</span>
            <span>Link 3</span>
            <span>Link 4</span>
            <span>Link 5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Footer);
