import React, { useState } from "react";
import { FaEye } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";
import { BsFillBagPlusFill, BsBagCheckFill } from "react-icons/bs";
import { formatMoney, renderStar } from "../ultils/helper";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../store/app/appSlice";
import { DetailProduct } from "../pages/public";
import { apiUpdateCart, apiUpdateWishlist } from "../apis";
import Swal from "sweetalert2";
import { getCurrentUser } from "../store/user/asyncActions";
import path from "../ultils/path";

const CardProduct = ({ productData, pid, className }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { current } = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [curentProduct, setCurrentProduct] = useState({
    title: "",
    images: "",
    price: "",
    color: "",
    quantity: 0,
    sold: 0,
  });

  const handleSelectOption = async (e, flag) => {
    e.stopPropagation();
    if (flag === "CART") {
      if (!current)
        return Swal.fire({
          title: "Almost...",
          text: "Please Log In To Do This Action",
          icon: "info",
          confirmButtonText: "Go Log In",
          showCancelButton: true,
          cancelButtonText: "Not now!",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
            cancelButton: "custom-cancel-button",
          },
        }).then((rs) => {
          if (rs.isConfirmed)
            navigate({
              pathname: `/${path.LOGIN}`,
              search: createSearchParams({
                redirect: location.pathname,
              }).toString(),
            });
        });

      //     const availableStock = product?.stockInfo?.[curentProduct?.color]?.quantity ||
      // product?.stockInfo?.[product?.color]?.quantity ||
      // // curentProduct?.quantity ||
      // // product?.quantity ||
      // 0;
      const availableStock =
        productData?.stockInfo?.[productData?.color]?.quantity || 0;

      if (availableStock <= 0) {
        return Swal.fire({
          title: "Out of Stock",
          text: "This product is currently out of stock and cannot be added to the cart.",
          icon: "info",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      }

      // const productPrice = curentProduct?.price || product?.price || 0;
      const productPrice = productData?.price || 0;
    if (productPrice <= 0) {
      return Swal.fire({
        title: "Not Ready!",
        text: "This product is not ready yet, you can add it to your favorites and wait later",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
    }

      const response = await apiUpdateCart({
        pid: productData?._id,
        color: productData?.color,
        stockInfo: 1,
        price: productData?.price,
        image: productData?.images[0],
        title: productData?.title,
      });

      if (response.success) {
        Swal.fire({
          title: "Updated",
          text: "Update Cart Successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
            cancelButton: "custom-cancel-button",
          },
        });
        dispatch(getCurrentUser());
      } else {
        Swal.fire({
          title: "Oops!",
          text: "Failed to Update Cart!",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
            cancelButton: "custom-cancel-button",
          },
        });
      }
    }

    if (flag === "WISHLIST") {
      if (!current)
        return Swal.fire({
          title: "Almost...",
          text: "Please Log In To Do This Action",
          icon: "info",
          confirmButtonText: "Go Log In",
          showCancelButton: true,
          cancelButtonText: "Not now!",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
            cancelButton: "custom-cancel-button",
          },
        }).then((rs) => {
          if (rs.isConfirmed)
            navigate({
              pathname: `/${path.LOGIN}`,
              search: createSearchParams({
                redirect: location.pathname,
              }).toString(),
            });
        });
      const response = await apiUpdateWishlist(pid);
      if (response.success) {
        dispatch(getCurrentUser());
        Swal.fire({
          title: "Updated!",
          text: "Updated Your Wishlist!",
          icon: "success",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
            cancelButton: "custom-cancel-button",
          },
        });
      } else
        Swal.fire({
          title: "Oops!",
          text: "Fail To Add Wishlist!",
          icon: "error",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
            cancelButton: "custom-cancel-button",
          },
        });
    }

    if (flag === "QUICK_VIEW") {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <DetailProduct
              data={{ pid: productData?._id, category: productData?.category }}
              isQuickView
            />
          ),
        })
      );
    }
  };

  const handleNavigate = () => {
    if (productData?.category && productData?._id && productData?.title) {
      navigate(
        `/${productData?.category?.toLowerCase()}/${productData?._id}/${
          productData?.title
        }`
      );
    } else {
      console.error("Category or product data is missing");
    }
  };

  return (
    <div
      onClick={handleNavigate}
      className="relative w-full border border-main border-opacity-40 rounded-[20px] transform transition-transform duration-300 hover:border-[#a8f5bf]"
    >
      <div className="relative rounded-[20px] w-full p-[12px] flex flex-col items-center bg-white">
        <div className={"relative w-full ${className}"}>
          <img
            src={
              productData?.images?.[0] ||
              "https://www.proclinic-products.com/build/static/default-product.30484205.png"
            }
            alt={productData?.title || "Product Image"}
            className="w-[270px] h-[270px] object-cover rounded-[15px]"
          />
          {/* Icons Container */}
          <div className="absolute px-14 py-2 bottom-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div
              title="Quick view"
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
              title="Add to Wishlist"
              onClick={(e) => handleSelectOption(e, "WISHLIST")}
              className="cursor-pointer"
            >
              <div className="bg-[#273526] text-white w-[40px] h-[40px] flex items-center justify-center rounded-full transition-colors duration-300 border-[#273526] border-2 ease-out hover:bg-white hover:text-[#6D8777] hover:border-[#6D8777]">
                <GoHeartFill
                  size={18}
                  color={
                    current?.wishlist?.some((i) => i._id === pid)
                      ? "#FC3C44"
                      : "gray"
                  }
                  className="transition-transform duration-500 ease-in-out hover:scale-125"
                />
              </div>
            </div>
            {current?.cart?.some((el) => el.product._id === productData._id) ? (
              <div title="Added to Cart" className="cursor-pointer">
                <div className="bg-[#273526] text-white w-[40px] h-[40px] flex items-center justify-center rounded-full transition-colors duration-300 border-[#273526] border-2 ease-out hover:bg-white hover:text-[#6D8777] hover:border-[#6D8777]">
                  <BsBagCheckFill
                    size={18}
                    color="#FC3C44"
                    className="transition-transform duration-500 ease-in-out hover:scale-125"
                  />
                </div>
              </div>
            ) : (
              <div
                title="Add to Cart"
                onClick={(e) => handleSelectOption(e, "CART")}
                className="cursor-pointer"
              >
                <div className="bg-[#273526] text-white w-[40px] h-[40px] flex items-center justify-center rounded-full transition-colors duration-300 border-[#273526] border-2 ease-out hover:bg-white hover:text-[#6D8777] hover:border-[#6D8777]">
                  <BsFillBagPlusFill
                    size={18}
                    className="transition-transform duration-500 ease-in-out hover:scale-125"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-[15px] w-full">
          <h3 className="text-[24px] font-semibold line-clamp-1">
            {productData?.title}
          </h3>
          <div className="flex flex-col gap-1">
            <span className="text-main text-[#273526] flex items-center gap-1">
              {renderStar(productData?.totalRatings)}
            </span>
            {/* <span className="text-[20px] text-[#d66363]">{`${formatMoney(
              productData?.price
            )} VNĐ`}</span> */}
            <span className="text-[20px] text-[#d66363]">
              {productData.price
                ? `${formatMoney(productData.price)} VNĐ`
                : "Not Available"}
            </span>

            <span className="text-main">{productData?.sold} Sold</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
