import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis/product";
import CardProduct from "../components/CardProduct";
import Slider from "react-slick";
import star from "../assets/star.png";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,

  // responsive: [
  //     {
  //         breakpoint: 1024,
  //         settings: {
  //             slidesToShow: 2,
  //             slidesToScroll: 1,
  //         }
  //     },
  //     {
  //         breakpoint: 600,
  //         settings: {
  //             slidesToShow: 1,
  //             slidesToScroll: 1,
  //         }
  //     }
  // ]
};

const NewArrival = () => {
  const [bestSellers, setBestSellers] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await apiGetProducts({ sort: "-createdAt", sold: "0", limit: "10" });
      if (response?.success) setBestSellers(response.productData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="rounded-[20px]">
      
      <div className="flex p-4 rounded-t justify-center items-center">
        <div className="flex-1 border-b border-gray-300 mx-2"></div>
        <div className="flex font-semibold uppercase text-white font-playfair text-[32px] text-center">
          new arrival products
        </div>
        <div className="flex-1 border-b border-gray-300 mx-2"></div>
      </div>
      
      <div className="flex justify-center font-extralight text-[20px] text-right text-white pb-2 ">
        <span >New products, bringing new styles to you, promise to be your next trust in us.</span>
       
      </div>
      <div className="mt-2 mx-[10px] p-2 mb-2">
        <Slider {...settings} className="horizontal-slider">
          {bestSellers?.length > 0 ? (
            bestSellers.map((el, idx) => (
              <div key={idx} className="p-2">
                <div className="card-product-best-sell ">
                  <CardProduct pid={el._id} productData={el} />
                </div>
              </div>
            ))
          ) : (
            <div>No Products Available</div>
          )}
        </Slider>
      </div>

      
    </div>
  );
};

export default NewArrival;
