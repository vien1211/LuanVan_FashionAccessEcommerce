import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct } from "../apis";
import { formatMoney, renderStar } from "../ultils/helper";
import DOMPurify from "dompurify";

const InfoProduct = () => {
  const { pid, variant } = useParams(); // Ensure variant comes from params if used in the route
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(variant || null);

  // Fetch product data based on pid
  const fetchProductData = async () => {
    try {
      const response = await apiGetProduct(pid);
      if (response.success) setProduct(response.productData);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (pid) fetchProductData();
  }, [pid]);

  // Handling variant changes if necessary
  useEffect(() => {
    if (variant) setSelectedVariant(variant);
  }, [variant]);

  const variantData = selectedVariant
    ? product?.variants?.find((el) => el.sku === selectedVariant)
    : null;

  return (
    <div className="h-auto flex flex-col mb-4 p-4 rounded-lg bg-[#F5F5FA]">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[35px] w-[60%] font-semibold line-clamp-1">
            {variantData?.title || product?.title}
          </span>
          <span className="text-[14px] font-light mr-10">{`Kho: ${
            variantData?.quantity || product?.quantity
          }`}</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-[16px] ml-2">{`By ${product?.brand}`}</span>
        </div>
        <div className="flex items-center mt-4">
          <span className="flex items-center gap-2 text-main">
            {renderStar(product?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span className="flex items-center ml-4 border-r pr-4">
            {`${product?.totalRatings}`}
          </span>
          <span className="text-[16px] ml-4 font-light border-r pr-4">{`Đã bán: ${
            product?.sold
          }`}</span>
          <span className="text-[16px] ml-4 font-light">{`Review: ${
            product?.ratings?.length || 0
          }`}</span>
        </div>

        <div className="text-[30px] font-semibold text-[#D86D6D] mt-4">
          {`${formatMoney(variantData?.price || product?.price)} VNĐ`}
        </div>

        <div className="relative border-t border-main mt-2 flex items-center">
          <span className="text-[22px] font-semibold py-6 pl-4 bg-white relative">
            Mô Tả Sản Phẩm
          </span>
          <div className="flex-grow ml-2"></div>
        </div>

        <ul className="list-disc list-inside font-light text-[16px] pl-4 mb-4">
          {product?.description?.length > 1 &&
            product?.description?.map((line, index) => (
              <li key={index}>{line}</li>
            ))}

          {product?.description?.length === 1 && (
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product?.description[0]),
              }}
            ></div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default InfoProduct;
