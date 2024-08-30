import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis/product";
import CardProduct from "../components/CardProduct";
import MiniBanner from "../components/MiniBanner";
import Slider from "react-slick";

const tabs = [
  { id: 1, name: "best seller" },
  { id: 2, name: "new product" },
];

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
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

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [activedTab, setActivedTab] = useState(1);

  const fetchProducts = async () => {
    try {
      const response = await Promise.all([
        apiGetProducts({ sort: "-sold" }),
        apiGetProducts({ sort: "-createdAt" }),
      ]);
      if (response[0]?.success) setBestSellers(response[0].productData);
      if (response[1]?.success) setNewProducts(response[1].productData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Determine which products to display based on the active tab
  const productsToDisplay = activedTab === 1 ? bestSellers : newProducts;

  return (
    <div className="border-2 border-main rounded-[20px] shadow-md">
      <div className="flex p-4 bg-main rounded-t-[17px] text-[20px] pb-4">
        {tabs.map((el) => (
          <span
            key={el.id}
            className={`font-semibold uppercase border-r-2 px-6 cursor-pointer ${
              activedTab === el.id ? "text-white underline" : "text-white opacity-50"
            }`}
            onClick={() => setActivedTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="mt-2 mx-[10px] p-2 mb-2">
        <Slider {...settings}>
          {productsToDisplay?.length > 0 ? (
            productsToDisplay.map((el, idx) => (
              <div key={idx} className="p-2">
                <CardProduct productData={el} />
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

export default BestSellers;
