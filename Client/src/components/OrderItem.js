import React, { useCallback, useEffect, useState } from "react";
import { formatMoney } from "../ultils/helper";
import SelectQuantity from "./SelectQuantity";
import { updateCart } from "../store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { apiRemoveCart } from "../apis";
import Swal from "sweetalert2";
import { getCurrentUser } from "../store/user/asyncActions";
import { AiFillDelete } from "react-icons/ai";

const OrderItem = ({ el, defaultQuantity = 1 }) => {
  const [quantity, setQuantity] = useState(() => defaultQuantity);
  const dispatch = useDispatch();

  const removeCart = async (pid, color) => {
    const response = await apiRemoveCart(pid, color);
    if (response.success) {
      dispatch(getCurrentUser());
    } else {
      Swal.fire({
        title: "Oops!",
        text: "Failed to Update Cart!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleRemoveCart = (pid, color) => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to remove this item from the cart?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      customClass: {
        title: "custom-title",
        text: "custom-text",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        removeCart(pid, color); // Gọi hàm xóa nếu người dùng xác nhận
        Swal.fire({
          title: 'Removed!',
          text: 'The item has been removed from your cart.',
          icon: 'success',
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
            cancelButton: "custom-cancel-button",
          },
        }
        );
      }
    });
  };

  const handleQuantity = useCallback((number) => {
    if (+number > 1) setQuantity(number);
  }, []);

  const handleChangeQuantity = useCallback(
    (flag) => {
      if (flag === "minus" && quantity === 1) return;
      if (flag === "minus") setQuantity((prev) => +prev - 1);
      if (flag === "plus") setQuantity((prev) => +prev + 1);
    },
    [quantity]
  );

  

  useEffect(() => {
    dispatch(updateCart({ pid: el.product?._id, quantity, color: el.color }));
  }, [quantity]);


  return (
    <div className="w-full rounded-[8px] mx-auto border font-bold my-2 py-2 grid grid-cols-10">
      <div className="col-span-5 w-full">
        <div className="flex gap-4 px-3 py-1">
          <img
            src={el?.image}
            alt="product"
            className="w-[85px] h-[85px] object-cover rounded-sm"
          />
          <div className="flex flex-col items-start gap-1">
            <span className="font-semibold text-[14px] text-main">{el.title}</span>
            <span className="text-[12px] font-light">{el.color}</span>
          </div>
        </div>
      </div>

      <div className="col-span-2 w-full text-center">
        <div className="flex items-center  h-full">
          <SelectQuantity
            quantity={quantity}
            handleQuantity={handleQuantity}
            handleChangeQuantity={handleChangeQuantity}
          />
        </div>
      </div>
      <div className="col-span-2 w-full h-full flex items-center text-center">
        <span className="text-[14px] font-normal">
          {formatMoney(el.price * quantity) + " VNĐ"}
        </span>
      </div>

      <div className="col-span-1 w-full flex items-center">
        <span
          onClick={() => handleRemoveCart(el.product?._id, el.color)}
          className="flex gap-2 h-12 w-12 rounded-full text-main hover:text-[#c05c6b] cursor-pointer items-center justify-center"
        >
          <AiFillDelete size={18} />
        </span>
      </div>
    </div>
  );
};

export default OrderItem;
