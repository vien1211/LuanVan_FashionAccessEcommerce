import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiGetProducts } from "../apis";
import CardProduct from "../components/CardProduct";
import Slider from "react-slick";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

const RelatedProduct = () => {
  const { category } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchProductData = async () => {
    try {
      const response = await apiGetProducts({ category });
      if (response.success) {
        setRelatedProducts(response.productData);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (category) fetchProductData();
  }, [category]);

  return (
    <div className="related-products">
      <h3 className="text-[22px] font-semibold py-2 border-b-2 border-main">
      You May Also Like
      </h3>
      <Slider {...settings}>
        {relatedProducts?.map((productData, index) => (
          <div key={index} className="px-1 mt-6">
            <CardProduct productData={productData} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RelatedProduct;
