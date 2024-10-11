import React, { memo } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { showCart, showModal } from "../store/app/appSlice";
import { formatMoney } from "../ultils/helper";
import Button from "./Button";
import { AiFillDelete } from "react-icons/ai";
import { apiRemoveCart } from "../apis";
import Swal from "sweetalert2";
import { getCurrentUser } from "../store/user/asyncActions";
import { useNavigate } from "react-router-dom";
import path from "../ultils/path";
import EmptyCart from "../assets/emptycart.png";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCart } = useSelector((state) => state.user);

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

 
  return (
    
    <div
      onClick={(e) => e.stopPropagation()}
      className="grid grid-rows-10 w-[400px] h-screen bg-white p-6 fixed animate-CartInRight"
    >
      <header className=" flex justify-between items-center border-b border-main row-span-1 h-full font-bold text-2xl">
        <span className="text-main font-bold">YOUR CART</span>
        <span
          onClick={() => dispatch(showCart())}
          className="cursor-pointer p-2"
        >
          {" "}
          <IoCloseCircle size={24} />
        </span>
      </header>
      <section className="row-span-7 flex flex-col gap-3 h-full max-h-full overflow-y-auto py-3">
        {currentCart.length === 0 && <img
          src={EmptyCart}
          className="w-[400px] h-auto mx-auto opacity-65"
          alt="Empty Cart"
        />}
        {currentCart &&
          currentCart?.map((el) => (
            <div
              key={el._id}
              className="flex justify-between w-full items-center"
            >
              <div className="flex gap-4">
                <img
                  src={el.image}
                  alt="product"
                  className="w-16 h-16 object-cover"
                />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-sm text-main">
                    {el.title}
                  </span>
                  <span className="text-[10px]">{el.color}</span>
                  <span className="text-[10px]">{`Quantity: ${el.quantity}`}</span>
                  <span className="text-sm">
                    {formatMoney(el.price) + " VNĐ"}
                  </span>
                </div>
              </div>
              <span
                onClick={() => removeCart(el.product?._id, el.color)}
                className="h-8 w-8 rounded-full hover:bg-gray-700 flex cursor-pointer items-center justify-center"
              >
                <AiFillDelete size={18} />
              </span>
            </div>
          ))}
      </section>

      <div className="row-span-2 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between pt-4 border-t">
          <span>SubTotal</span>
          <span className="text-sm">
            {formatMoney(
              currentCart?.reduce(
                (sum, el) => sum + Number(el.price)* el.quantity,
                0
              )
            ) + "VNĐ"}
          </span>
        </div>
        <span className="text-center text-xs">
          Go to Detail Shopping Cart to see detail and Check out
        </span>
        <Button
          handleOnClick={() => {
            dispatch(showCart());
            navigate(`/${path.DETAIL_CART}`);
            window.scrollTo(0, 0);
          }}
          name="Go To Detail Cart"
          style="flex items-center justify-center bg-main text-white text-[18px] p-3 rounded-lg w-[350px] hover:text-[#F5F5FA]"
        />
      </div>
    </div>
  );
};

export default memo(Cart);

