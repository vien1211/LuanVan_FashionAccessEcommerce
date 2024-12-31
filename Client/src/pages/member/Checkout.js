import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatMoney } from "../../ultils/helper";
import {
  ConfettiNoti,
  Paypal,
  ShippingFee,
  CashOnDelivery,
  Button,
} from "../../components";
import { useForm } from "react-hook-form";
import { getCurrentUser } from "../../store/user/asyncActions";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { apiApplyCoupon, apiCancelApplyCoupon, apiGetCoupon } from "../../apis";
import { FaMapMarkerAlt, FaUserAlt, FaPhoneAlt } from "react-icons/fa";
import NoCoupon from "../../assets/no coupon.png";

import moment from "moment";

const Checkout = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const { currentCart, current } = useSelector((state) => state.user);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const address = watch("address");

  const [coupon, setCoupon] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [hasUsedCoupon, setHasUsedCoupon] = useState(false);

  useEffect(() => {
    setValue("address", current?.address);
  }, [current?.address, setValue]);

  useEffect(() => {
    if (isSuccess) dispatch(getCurrentUser());
  }, [isSuccess, dispatch]);

  const subtotal = currentCart?.reduce(
    (sum, el) => +el?.price * el.quantity + sum,
    0
  );

  const calculateShippingFee = (subtotal) => {
    if (subtotal < 5000000) return 50000;
    if (subtotal >= 5000000 && subtotal <= 50000000) return 25000;
    return 0;
  };

  const totalBeforeDiscount = subtotal + calculateShippingFee(subtotal);
  const total = totalBeforeDiscount - discount;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await apiGetCoupon();
        if (response.success) {
          setCoupons(response.AllCoupon);
        } else {
          console.error("Failed to fetch coupons");
        }
      } catch (error) {
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

  const handleCouponApply = async () => {
    // Find a valid coupon based on the coupon code and expiry date
    const validCoupon = coupons.find(
      (c) => c.name === coupon && Date.now() < new Date(c.expire)
    );

    // If no valid coupon is found, show an error message
    if (!validCoupon) {
      Swal.fire({
        icon: "error",
        title: "Invalid Coupon",
        text: "The coupon code is not valid or has expired.",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      return;
    }

    // Check if the coupon has already been used by the current user
    if (validCoupon.usedBy && validCoupon.usedBy.includes(current._id)) {
      Swal.fire({
        icon: "error",
        title: "Coupon Already Used",
        text: "You have already used this coupon.",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      return;
    }

    // Make API call to apply the coupon
    try {
      const response = await apiApplyCoupon({
        userId: current._id,
        couponId: validCoupon._id,
      });

      // Check if the response is successful and structured correctly
      if (response.success) {
        setHasUsedCoupon(true);
        const discountAmount = (subtotal * validCoupon.discount) / 100;
        setDiscount(discountAmount);
        Swal.fire({
          icon: "success",
          title: "Coupon Applied!",
          text: `You've received a discount of ${formatMoney(
            discountAmount
          )} VNĐ.`,
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      } else {
        // Show a specific error message from the server response if available
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not apply the coupon.",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      }
    } catch (error) {
      // Display a generic error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not apply the coupon. Please try again later.",
        confirmButtonText: "OK",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
    }
  };

  const handleCouponCancel = async () => {
    // Reset the coupon state
    setCouponCode("");
    setDiscount(0);
    setHasUsedCoupon(false);

    // Find the coupon to cancel from the coupons list
    const couponToCancel = coupons.find((c) => c.name === coupon);

    if (!couponToCancel) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Coupon not found.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Send the request to remove the coupon usage
      const response = await apiCancelApplyCoupon({
        userId: current._id, // Ensure you have the user ID
        couponId: couponToCancel._id, // The coupon ID applied earlier
      });

      // Check response and show success or error messages
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Coupon Removed",
          text: "The coupon has been removed from your order.",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      // Handle errors during the API call
      console.error("Error removing coupon:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not remove the coupon. Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleOrder = async () => {
    try {
      await axios.post("/api/orders", {
        products: currentCart.map((item) => ({
          _id: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        address,
        total,
        paymentMethod,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const exchangeRate = 24880;
  const totalAfterDiscount = subtotal - discount;

  return (
    <div className="">
      <div className="bg-main h-full">
        <div className="flex w-main justify-between">
          <div className="flex px-2 py-2 ml-[9em] items-center">
            <span className="art-word-shadow-logo border-r px-4">
              VIEEN'S STORE
            </span>
            <span className="px-3 text-white text-[20px] font-light">
              Payment Page
            </span>
          </div>
          <div className="flex items-center py-2 -mr-[5em] text-slate-200">
            Quý khách hàng vui lòng liên hệ hotline 12345678 để được hỗ trợ trực
            tiếp
          </div>
        </div>
      </div>
      <div className="w-main grid grid-cols-10 mx-auto py-1 px-8 gap-8">
        {isSuccess && <ConfettiNoti />}
        <div className="col-span-7">
          <h2 className="text-3xl py-4 font-bold text-main">
            CHECK OUT YOUR ORDER
          </h2>

          <table className="table-auto w-full">
            <thead>
              <tr className="border bg-gray-200">
                <th className="p-2 text-left font-semibold">Products</th>
                <th className="p-2 text-left font-semibold">Color</th>
                <th className="p-2 text-center font-semibold">Quantity</th>
                <th className="p-2 text-right font-semibold">Unit Price</th>
                <th className="p-2 text-right font-semibold">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {currentCart?.map((el) => (
                <tr className="border" key={el._id}>
                  <td className="text-left p-2 text-main">{el.title}</td>
                  <td className="text-left p-2">{el.color}</td>
                  <td className="text-center">{el.quantity}</td>
                  <td className="text-right">
                    {formatMoney(el.price) + " VNĐ"}
                  </td>
                  <td className="text-right font-medium text-[#DC7974]">
                    {formatMoney(el.quantity * el.price) + " VNĐ"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-4">
            <div className="w-full h-fit mt-6 bg-slate-100 rounded-[10px] p-4">
              <h3 className="text-md font-semibold mb-2">Payment Methods</h3>
              <div className="bg-slate-50 rounded-[10px] border border-main border-opacity-50 shadow-sm p-4 flex flex-col">
                <label>
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    className="mr-2"
                  />
                  PayPal
                </label>
                <label className="mt-2">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mr-2"
                  />
                  Cash on Delivery
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 flex flex-col">
          <div className="h-fit shadow-md rounded-[15px] border mt-4 flex flex-col p-5">
            <div className="flex justify-between text-[16px] font-semibold mb-3">
              <span>Delivered To</span>
            </div>
            <div className="flex text-[14px]">
              <span className="border rounded-md p-1 text-main mr-2 h-fit">
                <FaUserAlt />
              </span>
              <span className="text-slate-400">
                {current?.firstname} {current?.lastname}
              </span>
            </div>
            <div className="flex text-[14px] my-2">
              <span className="border rounded-md p-1 text-main mr-2 h-fit">
                <FaPhoneAlt />
              </span>
              <span className="text-slate-400">{current?.mobile}</span>
            </div>
            <div className="flex text-[14px]">
              <span className="border rounded-md p-1 text-main mr-2 h-fit">
                <FaMapMarkerAlt />
              </span>
              <span className="text-slate-400">{current?.address}</span>
            </div>
          </div>

          <div className="mt-4 bg-white border border-gray-200 shadow-md rounded-[10px] p-4">
            <span className="text-md font-semibold">Special Offer</span>
            <ul className="mt-2">
              {coupons && coupons.length > 0 ? (
                <>
                  {coupons
                    .filter((coupon) => new Date(coupon.expire) > new Date())
                    .map((coupon) => (
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
                          Please enter the code into the box.
                        </span>
                      </li>
                    ))}
                  <div className="flex mt-4">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter coupon code"
                      className="border p-2 rounded w-full mr-2"
                    />

                    {hasUsedCoupon ? (
                      <Button
                        handleOnClick={handleCouponCancel}
                        name="Cancel"
                        style="bg-[#8f5151] text-white p-2 ml-2 rounded"
                      />
                    ) : (
                      <Button
                        handleOnClick={handleCouponApply}
                        name="Apply"
                        style="bg-[#fc3c44] text-white p-2 rounded"
                      />
                    )}
                  </div>
                </>
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

          <div className="h-fit my-[20px] col-span-3 p-5 shadow-md border rounded-[15px]">
            <div className="flex justify-between mb-4">
              <span>Subtotal</span>
              <span className="text-[#DA7474]">{`${formatMoney(
                subtotal
              )} VNĐ`}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Discount</span>
              <span className="text-[#DA7474]">
                - {formatMoney(discount)} VNĐ
              </span>
            </div>

            <ShippingFee
              subtotal={totalAfterDiscount}
              shippingFee={calculateShippingFee(subtotal)}
            />

            {address && address?.length > 10 && (
              <div className="flex flex-col gap-4">
                {paymentMethod === "paypal" && (
                  <Paypal
                    payload={{
                      products: currentCart,
                      total: total,
                      address,
                    }}
                    setIsSuccess={setIsSuccess}
                    amount={Math.round(total / exchangeRate)}
                  />
                )}

                {paymentMethod === "cod" && (
                  <CashOnDelivery
                    payload={{
                      products: currentCart,
                      total,
                      address,
                    }}
                    setIsSuccess={setIsSuccess}
                    amount={total}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
