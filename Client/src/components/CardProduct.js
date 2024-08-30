import React from "react";
import { FaEye } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";
import { RiMenu5Fill } from "react-icons/ri";
import { formatMoney, renderStar } from "../ultils/helper";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showModal } from "../store/app/appSlice";
import { DetailProduct } from "../pages/public";

const CardProduct = ({ productData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleSelectOption = (e, flag) => {
    e.stopPropagation();
    if (flag === "MENU") {
      navigate(
        `/${productData?.category?.toLowerCase()}/${productData?._id}/${
          productData?.title
        }`
      );
    }
    if (flag === "WISHLIST") console.log("Added to Wishlist");
    if (flag === "QUICK_VIEW"){
      dispatch(showModal({isShowModal: true, modalChildren: <DetailProduct data={{pid: productData?._id, category: productData?.category}} isQuickView />}))
    }
  };

  return (
    <div
      onClick={() =>
        navigate(
          `/${productData?.category?.toLowerCase()}/${productData?._id}/${
            productData?.title
          }`
        )
      }
      className="relative w-full"
    >
      <div className="w-full border border-main p-[15px] flex flex-col items-center bg-white">
        <div className="relative w-full">
          <img
            src={
              productData?.images?.[0] ||
              "https://www.proclinic-products.com/build/static/default-product.30484205.png"
            }
            alt={productData?.title || "Product Image"}
            className="w-[270px] h-[240px] object-cover"
          />
          {/* Icons Container */}
          <div className="absolute px-14 py-2 bottom-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div
              onClick={(e) => handleSelectOption(e, "QUICK_VIEW")}
              className="cursor-pointer"
            >
              <div className="bg-[#273526] text-white w-[40px] h-[40px] flex items-center justify-center rounded-full transition-colors duration-300 border-[#273526] border-2 ease-out hover:bg-white hover:text-[#6D8777] hover:border-[#6D8777]">
                <FaEye
                  size={18}
                  className="transition-transform duration-500 ease-in-out hover:scale-125"
                />
              </div>
            </div>
            <div
              onClick={(e) => handleSelectOption(e, "WISHLIST")}
              className="cursor-pointer"
            >
              <div className="bg-[#273526] text-white w-[40px] h-[40px] flex items-center justify-center rounded-full transition-colors duration-300 border-[#273526] border-2 ease-out hover:bg-white hover:text-[#6D8777] hover:border-[#6D8777]">
                <GoHeartFill
                  size={18}
                  className="transition-transform duration-500 ease-in-out hover:scale-125"
                />
              </div>
            </div>
            <div
              onClick={(e) => handleSelectOption(e, "MENU")}
              className="cursor-pointer"
            >
              <div className="bg-[#273526] text-white w-[40px] h-[40px] flex items-center justify-center rounded-full transition-colors duration-300 border-[#273526] border-2 ease-out hover:bg-white hover:text-[#6D8777] hover:border-[#6D8777]">
                <RiMenu5Fill
                  size={18}
                  className="transition-transform duration-500 ease-in-out hover:scale-125"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-[15px] w-full">
          <h3 className="text-[24px] font-semibold line-clamp-1">
            {productData?.title}
          </h3>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
              <span className="text-main text-[#273526] flex items-center gap-1">
                {renderStar(productData?.totalRatings)}
              </span>
              <span className="text-[20px] text-[#d66363]">{`${formatMoney(
                productData?.price
              )} VNĐ`}</span>
              <span className="text-main">Đã bán {productData?.sold}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
