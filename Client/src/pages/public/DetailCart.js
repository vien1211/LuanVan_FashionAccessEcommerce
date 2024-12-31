import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatMoney } from "../../ultils/helper";
import { Button, OrderItem, ShippingFee } from "../../components";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import Swal from "sweetalert2";
import EmptyCart from "../../assets/emptycart.png";
import { AiFillDelete } from "react-icons/ai";
import { apiGetCoupon } from "../../apis"; // Import the service
import { CiEdit } from "react-icons/ci";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import moment from "moment";
import NoCoupon from "../../assets/no coupon.png";

const DetailCart = () => {
  const { current, currentCart } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [coupons, setCoupons] = useState([]); // State to hold the coupons

  // Fetch coupons on component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await apiGetCoupon();
        console.log(response); // Log the entire response
        if (response.success) {
          setCoupons(response.AllCoupon); // Access AllCoupon directly
        } else {
          console.error("Failed to fetch coupons");
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not load coupons.",
          confirmButtonText: "OK",
        });
      }
    };

    fetchCoupons();
  }, []);

  // Calculate the subtotal
  const subtotal =
    currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0) || 0;

  const calculateProgress = () => {
    if (subtotal >= 50000000) return 100; // Free shipping achieved
    if (subtotal >= 5000000) return ((subtotal - 5000000) / 45000000) * 75 + 25;
    return (subtotal / 5000000) * 25;
  };

  const progress = calculateProgress();

  const getNextDiscountInfo = () => {
    if (subtotal < 5000000) {
      return { amount: 5000000 - subtotal, fee: 50000 };
    } else if (subtotal < 50000000) {
      return { amount: 50000000 - subtotal, fee: 25000 };
    } else {
      return null; // Free shipping achieved
    }
  };

  const nextDiscountInfo = getNextDiscountInfo();

  const handleCouponApply = () => {
    const validCoupon = coupons?.find(
      (c) => c.name === coupon && Date.now() < new Date(c.expire)
    );
    if (validCoupon) {
      const discountAmount = (subtotal * validCoupon.discount) / 100; // Calculate discount amount
      setDiscount(discountAmount);
      Swal.fire({
        icon: "success",
        title: "Coupon Applied!",
        text: `You've received a discount of ${formatMoney(
          discountAmount
        )} VNĐ.`,
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Coupon",
        text: "The coupon code is not valid or has expired.",
        confirmButtonText: "OK",
      });
    }
  };

  const totalAfterDiscount = subtotal - discount;

  const handleSubmit = () => {
    if (current?.isBlocked) {
      return Swal.fire({
        icon: "error",
        title: "Account Blocked!",
        text: "Your account is blocked, and you cannot check out at this time.",
        confirmButtonText: "OK",
      });
    }

    if (!current?.address) {
      return Swal.fire({
        icon: "info",
        title: "Add your Address!",
        text: "Please update your Address to order products!",
        showCancelButton: true,
        cancelButtonText: "No",
        showConfirmButton: true,
        confirmButtonText: "Go Add Address",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate({
            pathname: `/${path.MEMBER}/${path.PERSONAL}`,
            search: createSearchParams({
              redirect: location.pathname,
            }).toString(),
          });
        }
      });
    } else {
      window.open(`${path.CHECKOUT}`, "_blank");
    }
  };

  const handleEditAddress = () => {
    navigate({
      pathname: `/${path.MEMBER}/${path.PERSONAL}`,
      search: createSearchParams({ redirect: location.pathname }).toString(),
    });
  };

  return (
    <div className="w-full flex gap-8 mb-3">
      <div className="w-[70%] flex flex-col">
        {/* Progress Bar Section */}
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4 mb-2">
          <div
            className={`h-4 rounded-full ${
              progress >= 100 ? "bg-main" : "bg-[#fc3c44]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-700 mb-2">
          {subtotal >= 100000000
            ? "You have free shipping for your order!"
            : subtotal >= 50000000
            ? "You have free shipping for your order!"
            : subtotal >= 10000000
            ? "Spend more to reduce your shipping fee!"
            : "Add more products to reduce your shipping fee!"}
        </p>

        {/* Display the next discount level info */}
        {nextDiscountInfo && (
          <p className="text-sm text-gray-700 mb-4">
            {`Spend ${formatMoney(
              nextDiscountInfo.amount
            )} VNĐ more to reduce your shipping fee to ${formatMoney(
              nextDiscountInfo.fee
            )} VNĐ.`}
          </p>
        )}

        {/* Product Details Section */}
        <h3 className="text-[24px] text-main font-semibold tracking-tight my-2">
          YOUR CART
        </h3>
        <div className="w-full rounded-[8px] bg-main opacity-90 text-white py-2 font-bold grid grid-cols-10 ">
          <div className="col-span-5 w-full text-left px-4">Products</div>
          <div className="col-span-2 w-full text-left">Quantity</div>
          <div className="col-span-2 w-full text-left">Price</div>
          <div className="col-span-1 w-full text-center px-4">
            <AiFillDelete size={18} />
          </div>
        </div>
        {currentCart.length === 0 && (
          <img
            src={EmptyCart}
            className="w-[250px] h-auto mx-auto opacity-65"
            alt="Empty Cart"
          />
        )}
        {currentCart?.map((el) => (
          <OrderItem key={el._id} el={el} defaultQuantity={el.quantity} />
        ))}
      </div>

      <div className="w-[30%] flex flex-col">
        <div className="h-fit shadow-md rounded-[15px] border mt-4 flex flex-col p-5">
          <div className="flex justify-between text-[16px] font-semibold mb-3">
            <span>Shipping Address</span>
            <button onClick={handleEditAddress} className="text-main">
              <CiEdit size={24} />
            </button>
          </div>

          <div className="flex text-[14px]">
            <span className="border rounded-md p-1 text-main mr-2 h-fit">
              <FaMapMarkerAlt />
            </span>
            <span className="text-slate-400">
              {current?.address || "No Shipping Address"}
            </span>
          </div>
        </div>

        <div className="mt-4 bg-white border border-gray-200 shadow-md rounded-[10px] p-4">
          <h3 className="text-md font-semibold">Special Offer</h3>
          <ul className="mt-2">
            {coupons && coupons.length > 0 ? (
              coupons
                .filter((coupon) => new Date(coupon.expire) > new Date()) // Filter out expired coupons
                .map((coupon) => {
                  const usagePercentage = Math.min(
                    ((coupon.usedBy.length / coupon.usageLimit) * 100).toFixed(
                      2
                    ), // Tính phần trăm và giới hạn tối đa là 100%
                    100
                  );

                  return (
                    <li
                      key={coupon.id}
                      className="mt-2 p-4 bg-[#e8f3ec] rounded-md"
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold">{coupon.name}</span>
                        <span className="text-main">
                          {coupon.discount}% off
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Valid until{" "}
                        {moment(coupon.expire).format("DD [Th]MM, YYYY")}
                      </div>
                      <span className="text-xs text-gray-400">
                        Please Checkout and enter the code into the box
                      </span>
                      <div className="mt-2">
                        <div className="w-full bg-gray-300 rounded-full h-1.5">
                          <div
                            className="bg-main h-1.5 rounded-full"
                            style={{ width: `${usagePercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {usagePercentage}% used
                        </div>
                      </div>
                    </li>
                  );
                })
            ) : (
              <div className="text-center">
                <img
                  src={NoCoupon}
                  alt="No Coupon Active"
                  className="w-full h-full opacity-65"
                />
              </div>
            )}
          </ul>
        </div>

        {/* Summary Section */}
        <div className=" shadow-md rounded-[15px] h-fit border mt-4 flex flex-col p-5">
          <span className="text-lg font-semibold mb-3 text-main">SUMMARY</span>
          <div className="flex border-t py-2 justify-between mb-2">
            <span className="mt-1">Subtotal</span>
            <span className="mt-1 font-bold">{`${formatMoney(
              subtotal
            )} VNĐ`}</span>
          </div>

          {/* Pass the new total to ShippingFee */}
          <ShippingFee subtotal={totalAfterDiscount} />

          <Button
            handleOnClick={handleSubmit}
            name="CHECK OUT"
            style="bg-[#fc3c44] p-3 text-white w-[330px] text-[16px] rounded-md hover:bg-[#e67378]"
          />
        </div>
      </div>
    </div>
  );
};

export default DetailCart;
