// src/Components/ProductCard.js
import React from "react";
import { formatMoney, renderStar } from "../../ultils/helper";
import { Link, useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        if (product?.category && product?._id && product?.title) {
          navigate(
            `/${product?.category?.toLowerCase()}/${product?._id}/${product?.title}`
          );
        } else {
          console.error('Category or product data is missing');
        }
      };
  return (
    
    <div onClick={handleNavigate} className="bg-white border border-[#8cba7d] p-2 rounded-md shadow-md flex flex-col">
      <img
        src={product?.images[0]}
        alt={product?.title}
        className="h-38 w-38 object-contain rounded-md mb-2"
      />
      <h3 className="font-semibold text-[14px] text-main mb-1">{product?.title}</h3>
      <p className="text-gray-600 flex mb-1">{renderStar(product?.totalRatings)}</p>
      <p className="text-gray-600">{`${formatMoney(product?.price)} VNĐ`}</p>
    </div>
    
  );
};

export default ProductCard;
