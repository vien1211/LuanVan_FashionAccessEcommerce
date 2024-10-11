// import React, { useEffect, useState } from "react";
// import { navigation } from "../ultils/contants";
// import { NavLink } from "react-router-dom";
// import { apiGetAllBrand, apiGetCategories } from "../apis"; // Adjust the import as needed
// import path from "../ultils/path";
// import img from "../assets/bag.png";
// import { useSelector } from "react-redux";
// import icons from "../ultils/icons";

// const {IoIosArrowDown} = icons

// const Navigation = () => {
//   const [brands, setBrands] = useState([]);
//   const { categories } = useSelector((state) => state.app);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showCategoryPopup, setShowCategoryPopup] = useState(false);
//   const [isHeaderSmall, setIsHeaderSmall] = useState(false);
//   const [isInfoHidden, setIsInfoHidden] = useState(false);

//   useEffect(() => {
//     const fetchBrands = async () => {
//       const response = await apiGetAllBrand();
//       if (response.success) {
//         setBrands(response.allbrand); // Adjust based on your actual response structure
//       }
//     };

//     fetchBrands();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setIsHeaderSmall(true);
//         setIsInfoHidden(true);
//       } else {
//         setIsHeaderSmall(false);
//         setIsInfoHidden(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const handleBrandsClick = () => {
//     setShowPopup((prev) => !prev);
//   };

//   const handleCategoryClick = () => {
//     setShowCategoryPopup((prev) => !prev);
//   };

//   return (
//     <div className={`w-main h-[40px] justify-center bg-[#F5F5FA] shadow-lg border border-main rounded-full text-md flex items-center transition-all duration-300 ${isHeaderSmall ? 'h-[45px] w-screen rounded-none' : 'h-[45px]'}`}>
//       {navigation.map((el) => (
//         <NavLink
//           to={el.path}
//           key={el.id}
//           className={({ isActive }) =>
//             isActive
//               ? "pr-12 hover:text-main text-main underline"
//               : "pr-12 hover:text-main"
//           }
//         >
//           {el.value}
//         </NavLink>
//       ))}

//       <div className="relative">
//         <div
//           className="pr-12 hover:text-main cursor-pointer flex items-center gap-2"
//           onClick={handleBrandsClick}
//         >
//           BRANDS
//           <IoIosArrowDown className="hover:text-main"/>
//         </div>

//         {showPopup && (
//           <div className="absolute rounded-b-[110px] top-full -ml-[133px] transform -translate-x-1/2 w-main shadow-lg mt-5 z-20">
//             <div className="flex w-full bg-main  rounded-b-[110px] rounded-t-[30px]  p-6 shadow-xl">
//               <div className="flex w-full bg-white shadow-sm rounded-b-[110px] rounded-t-[20px] p-2">
//                 {/* Left Side - Image */}
//                 <div className="w-1/3 border-r border-main ">
//                 {/* <span className="art-word-shadow flex items-center justify-center">
//                     Top
//                   </span> */}
//                   <div className="flex justify-center">
//                     <img
//                       src={img}
//                       alt="Brand Image"
//                       className="w-[280px] flex mb-4 h-auto duration-300 hover:scale-110"
//                     />
//                   </div>

//                   <span className="art-word-shadow flex items-center justify-center">
//                     Brands
//                   </span>
//                 </div>

//                 {/* Right Side - Brand List */}
//                 <div className="w-2/3 p-4 ml-4 text-[16px] font-light">
//                   <div className="grid grid-cols-4 gap-3">
//                     {brands.map((brand) => (
//                       <NavLink
//                         to={`/products?brand=${brand.title}`}
//                         key={brand.id}
//                         className={"py-1 hover:text-main"}
//                         onClick={() => setShowPopup(false)}
//                       >
//                         {brand.title}
//                       </NavLink>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="relative">
//         <div
//           className="pr-12 hover:text-main cursor-pointer flex gap-2 items-center"
//           onClick={handleCategoryClick}
//         >
//           CATEGORIES
//           <IoIosArrowDown className=" hover:text-main"/>
//         </div>

//         {showCategoryPopup && (
//           <div className="absolute rounded-b-[110px] top-full -ml-[268px] transform -translate-x-1/2 w-main shadow-lg mt-5 z-20">
//             <div className="flex w-full bg-main rounded-b-[110px]  p-6 shadow-xl rounded-t-[30px]">
//               <div className="flex w-full bg-white shadow-sm p-2 rounded-t-[20px] rounded-b-[110px]">
//                 <div className="w-1/3 border-r border-main">
//                 {/* <span className="art-word-shadow flex justify-center">
//                     Top
//                   </span> */}
//                   <div className="flex justify-center">

//                     <img
//                       src={img}
//                       alt="Brand Image"
//                       className="w-[280px]  duration-300  hover:scale-110"
//                     />
//                   </div>

//                   <span className="art-word-shadow flex justify-center">
//                     Category
//                   </span>
//                 </div>

//                 <div className="w-2/3 p-3 ml-4 text-[16px] font-light">
//                   <div className="grid grid-cols-4 gap-3">
//                     {categories?.map((category) => (
//                       <NavLink
//                         to={`/${category.title}`}
//                         key={category._id}
//                         className={({ isActive }) =>
//                           isActive
//                             ? "py-1 text-main font-bold"
//                             : "py-1 hover:text-main"
//                         }
//                         onClick={() => setShowCategoryPopup(false)}
//                       >
//                         {category.title}
//                       </NavLink>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navigation;

import React, { useEffect, useState } from "react";
import { navigation } from "../ultils/contants";
import { NavLink } from "react-router-dom";
import { apiGetAllBrand } from "../apis"; // Adjust the import as needed
import path from "../ultils/path";
import img from "../assets/bag.png";
import { useSelector } from "react-redux";
import icons from "../ultils/icons";

const { IoIosArrowDown } = icons;

const Navigation = () => {
  const [brands, setBrands] = useState([]);
  const { categories } = useSelector((state) => state.app);
  const [showPopup, setShowPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [isHeaderSmall, setIsHeaderSmall] = useState(false);
  const [isInfoHidden, setIsInfoHidden] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await apiGetAllBrand();
      if (response.success) {
        setBrands(response.allbrand); // Adjust based on your actual response structure
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsHeaderSmall(true);
        setIsInfoHidden(true);
      } else {
        setIsHeaderSmall(false);
        setIsInfoHidden(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBrandsClick = () => {
    setShowPopup((prev) => !prev);
  };

  const handleCategoryClick = () => {
    setShowCategoryPopup((prev) => !prev);
  };

  return (
    <div
      className={`w-main h-[40px] justify-center bg-[#F5F5FA] shadow-lg border border-main rounded-full text-md flex items-center transition-all duration-300 ${
        isHeaderSmall ? "h-[45px] w-screen rounded-none" : "h-[45px]"
      }`}
    >
      {navigation.map((el) => (
        <NavLink
          to={el.path}
          key={el.id}
          className={({ isActive }) =>
            isActive
              ? "pr-12 hover:text-main text-main underline"
              : "pr-12 hover:text-main"
          }
        >
          {el.value}
        </NavLink>
      ))}

      {/* Mega Menu for Brands */}
      <div className="relative">
        <div
          className="pr-12 hover:text-main cursor-pointer flex items-center gap-2"
          onClick={handleBrandsClick}
        >
          BRANDS
          <IoIosArrowDown className="hover:text-main" />
        </div>

        {showPopup && (
          <div className="absolute rounded-[20px] top-full -ml-[133px] transform -translate-x-1/2 w-main shadow-xl mt-5 z-20 bg-white">
            <div className="flex flex-col w-full p-4">
              <div className="flex justify-center items-center mb-4">
                <img
                  src={img}
                  alt="Brand Image"
                  className="w-[250px] duration-300 hover:scale-110 animate-slideInLeft"
                />
                <div className="items-start animate-slideInRight">
                  <span className="art-word-shadow flex items-center ">
                    Brand
                  </span>
                  <span className="gradient-text flex items-center ">
                    Products
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 animate-slideInUp">
                {brands.map((brand) => (
                  <NavLink
                    to={`/products?brand=${brand.title}`}
                    key={brand.id}
                    className={"py-2 hover:text-main text-center"}
                    onClick={() => setShowPopup(false)}
                  >
                    {brand.title}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mega Menu for Categories */}
      <div className="relative">
        <div
          className="pr-12 hover:text-main cursor-pointer flex gap-2 items-center"
          onClick={handleCategoryClick}
        >
          CATEGORIES
          <IoIosArrowDown className="hover:text-main" />
        </div>

        {showCategoryPopup && (
          <div className="absolute rounded-[20px] top-full -ml-[268px] transform -translate-x-1/2 w-main shadow-lg mt-5 z-20 bg-white">
            <div className="flex flex-col w-full p-6">
              <div className="flex justify-center items-center mb-4">
                <img
                  src={img}
                  alt="Category Image"
                  className="w-[250px] duration-300 hover:scale-110 animate-slideInLeft"
                />
                <div className="items-start animate-slideInRight">
                  <span className="art-word-shadow flex items-center ">
                    category
                  </span>
                  <span className="gradient-text flex items-center ">
                    Products
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 animate-slideInUp">
                {categories?.map((category) => (
                  <NavLink
                    to={`/${category.title}`}
                    key={category._id}
                    className={({ isActive }) =>
                      isActive
                        ? "py-2 text-main font-bold text-center"
                        : "py-2 hover:text-main text-center"
                    }
                    onClick={() => setShowCategoryPopup(false)}
                  >
                    {category.title}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
