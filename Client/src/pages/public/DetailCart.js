
import React from "react";
import { useSelector } from "react-redux";
import { formatMoney } from "../../ultils/helper";
import { Button, OrderItem, ShippingFee } from "../../components";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import Swal from "sweetalert2";
import EmptyCart from "../../assets/emptycart.png";
import { AiFillDelete } from "react-icons/ai";

const DetailCart = () => {
  
  const { current, currentCart } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Calculate the subtotal
  const subtotal = currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0) || 0;

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
  

  const handleSubmit = () => {
    if (current?.isBlocked) {
      return Swal.fire({
        icon: 'error',
        title: 'Account Blocked!',
        text: 'Your account is blocked, and you cannot check out at this time.',
        confirmButtonText: 'OK',
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      });
    }
    if (!current?.address) {
      return Swal.fire({
        icon: 'info',
        title: 'Add your Address!',
        text: 'Please update your Address to Order Product!',
        showCancelButton: true,
        cancelButtonText: 'No',
        showConfirmButton: true,
        confirmButtonText: 'Go Add Address',
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      }).then((result) => {
        if (result.isConfirmed) navigate({
          pathname: `/${path.MEMBER}/${path.PERSONAL}`,
          search: createSearchParams({ redirect: location.pathname }).toString()
        })
      })
    } else {
      window.open(`${path.CHECKOUT}`, '_blank')
    }
  };

  return (
    <div className="w-full flex gap-8 mb-3">
      <div className="w-[70%] flex flex-col">
        {/* Progress Bar Section */}
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4 mb-2">
          <div
            className={`h-4 rounded-full ${progress >= 100 ? 'bg-main' : 'bg-[#fc3c44]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-700 mb-2">
          {subtotal >= 100000000 ? 'You have free shipping for your order!' :
            subtotal >= 50000000 ? 'Spend more to get free shipping!' :
              subtotal >= 10000000 ? 'Spend more to reduce your shipping fee!' :
                'Add more products to reduce your shipping fee!'}
        </p>

        {/* Display the next discount level info */}
        {nextDiscountInfo && (
          <p className="text-sm text-gray-700 mb-4">
            {`Spend ${formatMoney(nextDiscountInfo.amount)} VNĐ more to reduce your shipping fee to ${formatMoney(nextDiscountInfo.fee)} VNĐ.`}
          </p>
        )}

        {/* Product Details Section - 70% Width */}
        <h3 className="text-[24px] text-main font-semibold tracking-tight my-3">YOUR CART</h3>
        <div className="w-full rounded-[8px] bg-main opacity-90 text-white py-3 font-bold grid grid-cols-10 ">
          <div className="col-span-5 w-full text-left px-4">Products</div>
          <div className="col-span-2 w-full text-left">Quantity</div>
          <div className="col-span-2 w-full text-left">Price</div>
          <div className="col-span-1 w-full text-center px-4"><AiFillDelete size={18} /></div>
        </div>
        {currentCart.length === 0 && <img
          src={EmptyCart}
          className="w-[250px] h-auto mx-auto opacity-65"
          alt="Empty Cart"
        />}
        {currentCart?.map((el) => (
          <OrderItem
            key={el._id}
            el={el}
            defaultQuantity={el.quantity}
          />
        ))}
      </div>

      {/* Summary Section - 30% Width */}
      <div className="w-[30%] shadow-md rounded-[15px] h-full border mt-8 flex flex-col p-5">
        <span className="text-lg font-semibold mb-3">SUMMARY</span>
        <div className="flex border-t py-2 justify-between mb-2">
          <span className="mt-1">Subtotal</span>
          <span className="mt-1 font-bold">{`${formatMoney(subtotal)} VNĐ`}</span>
        </div>
        
          <ShippingFee  subtotal={subtotal}/>
     
        {/* <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span className="text-[#DA7474]">{`${formatMoney(subtotal)} VNĐ`}</span>
        </div> */}
        <Button handleOnClick={handleSubmit} name="CHECK OUT" style="bg-[#fc3c44] p-3 text-white w-[330px] text-[16px] rounded-md" />
      </div>
    </div>
  );
};

export default DetailCart;





