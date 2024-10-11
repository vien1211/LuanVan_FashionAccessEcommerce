import React from "react";
import { formatMoney } from "../ultils/helper";

const ShippingFee = ({ subtotal }) => {
  
  const calculateShippingFee = (subtotal) => {
    let shippingFee = 50000; 

    if (subtotal >= 50000000) {
      shippingFee = 0; 
    } else if (subtotal >= 5000000) {
      shippingFee = 25000; 
    }

    return shippingFee;
  };

  const shippingFee = calculateShippingFee(subtotal);
  const total = subtotal + shippingFee;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <span>Shipping Fee</span>
        <span className="text-gray-600 font-bold">{`${formatMoney(
          shippingFee
        )} VNĐ`}</span>
      </div>
      <div className="flex justify-between font-bold text-lg mb-2">
        <span>TOTAL</span>
        <span className="text-[#DA7474] text-[24px]">{`${formatMoney(
          total
        )} VNĐ`}</span>
      </div>
      <span className="flex justify-end mb-2 text-[13px] italic">(VAT included if applicable)</span>
    </div>
  );
};

export default ShippingFee;
