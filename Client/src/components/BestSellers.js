// import React, { useEffect, useState } from "react";
// import { apiGetProducts } from "../apis/product";
// import CardProduct from "../components/CardProduct";
// import MiniBanner from "../components/MiniBanner";
// import Slider from "react-slick";

// const tabs = [
//   { id: 1, name: "best seller" },
//   { id: 2, name: "new product" },
// ];

// const settings = {
//   dots: false,
//   infinite: false,
//   speed: 500,
//   slidesToShow: 3,
//   slidesToScroll: 1,

//   // responsive: [
//   //     {
//   //         breakpoint: 1024,
//   //         settings: {
//   //             slidesToShow: 2,
//   //             slidesToScroll: 1,
//   //         }
//   //     },
//   //     {
//   //         breakpoint: 600,
//   //         settings: {
//   //             slidesToShow: 1,
//   //             slidesToScroll: 1,
//   //         }
//   //     }
//   // ]
// };

// const BestSellers = () => {
//   const [bestSellers, setBestSellers] = useState([]);
//   const [newProducts, setNewProducts] = useState([]);
//   const [activedTab, setActivedTab] = useState(1);

//   const fetchProducts = async () => {
//     try {
//       const response = await Promise.all([
//         apiGetProducts({ sort: "-sold" }),
//         apiGetProducts({ sort: "-createdAt" }),
//       ]);
//       if (response[0]?.success) setBestSellers(response[0].productData);
//       if (response[1]?.success) setNewProducts(response[1].productData);
//     } catch (error) {
//       console.error("Failed to fetch products:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Determine which products to display based on the active tab
//   const productsToDisplay = activedTab === 1 ? bestSellers : newProducts;

//   return (
//     <div className="border-2 border-main rounded-[20px] shadow-md">
//       <div className="flex p-4 bg-main rounded-t-[17px] text-[20px] pb-4">
//         {tabs.map((el) => (
//           <span
//             key={el.id}
//             className={`font-semibold uppercase border-r-2 px-6 cursor-pointer ${
//               activedTab === el.id ? "text-white underline" : "text-white opacity-50"
//             }`}
//             onClick={() => setActivedTab(el.id)}
//           >
//             {el.name}
//           </span>
//         ))}
//       </div>
//       <div className="mt-2 mx-[10px] p-2 mb-2">
//         <Slider {...settings}>
//           {productsToDisplay?.length > 0 ? (
//             productsToDisplay.map((el, idx) => (
//               <div key={idx} className="p-2">
//                 <CardProduct pid={el._id} productData={el} />
//               </div>
//             ))
//           ) : (
//             <div>No Products Available</div>
//           )}
//         </Slider>
//       </div>

//     </div>
//   );
// };

// export default BestSellers;

import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis/product";
import CardProduct from "../components/CardProduct";
import Slider from "react-slick";
import star from "../assets/star.png";
import { WiStars } from "react-icons/wi";


const horizontalSettings = {
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

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await apiGetProducts({ sort: "-sold", limit: "10" });
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
      <div className="w-screen flex relative">
      <WiStars
            
            alt="star"
            className="object-contain h-[70px] w-[100px] opacity-15 absolute mt-16 left-[160px]"
          />
      </div>
      <div className="flex p-4 rounded-t-[17px] justify-center items-center">
        <div className="flex-1 border-b border-gray-300 mx-2"></div>
        <div className="font-semibold uppercase text-white font-playfair text-[32px] text-center">
          Best Sellers For Your Choice
        </div>

        <div className="flex-1 border-b border-gray-300 mx-2"></div>
      </div>

      <div className="font-extralight text-[20px] text-white text-center p-2">
        <span className="">
          Our top products, with outstanding value and trust from many
          customers.
        </span>
        <br />
        <span>
          We are pleased to introduce them to you and hope you will love them.
        </span>
      </div>

      <div className="mt-2 mx-[10px] p-2 mb-2">
        <Slider {...horizontalSettings} className="horizontal-slider">
          {bestSellers?.length > 0 ? (
            bestSellers.map((el, idx) => (
              <div key={idx} className="p-2">
                <div className="card-product-best-sell">
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

export default BestSellers;
