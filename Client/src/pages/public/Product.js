// import React, { useEffect, useState, useCallback } from "react";
// import {
//   useParams,
//   useSearchParams,
//   useNavigate,
//   createSearchParams,
// } from "react-router-dom";
// import {
//   Breadcrumb,
//   CardProduct,
//   SearchItem,
//   InputSelect,
//   Pagination,
// } from "../../components";
// import { apiGetProducts } from "../../apis";
// import Masonry from "react-masonry-css";
// import { sorts } from "../../ultils/contants";

// const breakpointColumnsObj = {
//   default: 4,
//   1100: 3,
//   700: 2,
//   500: 1,
// };

// const Product = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState(null);
//   const [activeClick, setActiveClick] = useState(null);
//   const [params] = useSearchParams();
//   const [sort, setSort] = useState("");
//   const { category, brand } = useParams();

//   const fetchProducts = async (queries) => {
//     if(category && category !== 'products') queries.category = category
//     const response = await apiGetProducts(queries);
//     if (response.success) setProducts(response);
//   };

//   useEffect(() => {
//     const queries = Object.fromEntries([...params]);

//     let priceQuery = {};
//     for (let i of params) queries[i[0]] = i[1];

//     if (queries.to && queries.from) {
//       priceQuery = {
//         $and: [
//           { price: { gte: queries.from } },
//           { price: { lte: queries.to } },
//         ],
//       };
//       delete queries.price;
//     } else {
//       if (queries.from) queries.price = { gte: queries.from };
//       if (queries.to) queries.price = { lte: queries.to };
//     }

//     delete queries.to;
//     delete queries.from;

//     const q = {
//       ...priceQuery,
//       ...queries,
//       category,
//       brand,
//       limit: process.env.REACT_APP_LIMIT || 10,
//       page: params.get("page") || 1,
//     };

//     fetchProducts(q);

//     window.scrollTo(0, 0);
//   }, [params, fetchProducts, category, brand]);

//   const ChangeActiveFilter = useCallback(
//     (name) => {
//       if (activeClick === name) setActiveClick(null);
//       else setActiveClick(name);
//     },
//     [activeClick]
//   );

//   const changeValue = useCallback((value) => {
//     setSort(value);
//   }, []);

//   useEffect(() => {
//     if (sort) {
//       navigate({
//         pathname: `/${category || brand}`,
//         search: createSearchParams({ sort }).toString(),
//       });
//     }
//   }, [sort, category, brand, navigate]);

//   return (
//     <div>
//       <div className="h-[50px] flex justify-center items-center p-4 bg-[#F5F5FA]">
//         <div className="w-main">
//           <Breadcrumb category={category || brand} />
//         </div>
//       </div>
//       <div className="w-main border p-4 flex justify-between mt-8 m-auto">
//         <div className="w-4/5 flex flex-col gap-3">
//           <span className="font-main text-sm">Filter By</span>
//           <div className="flex items-center gap-4">
//             <SearchItem
//               name="price"
//               activeClick={activeClick}
//               ChangeActiveFilter={ChangeActiveFilter}
//               type="input"
//             />
//             <SearchItem
//               name="color"
//               activeClick={activeClick}
//               ChangeActiveFilter={ChangeActiveFilter}
//             />
//           </div>
//         </div>
//         <div className="w-1/5 flex flex-col gap-3">
//           <span className="font-main text-sm">Sort By</span>
//           <div className="w-full">
//             <InputSelect
//               changeValue={changeValue}
//               value={sort}
//               options={sorts}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="w-main mt-8 m-auto">
//         <Masonry
//           breakpointCols={breakpointColumnsObj}
//           className="my-masonry-grid"
//           columnClassName="my-masonry-grid_column"
//         >

//           {products?.productData?.map((el) => (
//             <div key={el.id}>
//                 <CardProduct pid={el.id} productData={el} />
//             </div>

//           ))}
//         </Masonry>
//       </div>

//       <div className=" m-auto flex justify-end my-4">
//         <Pagination totalCount={products?.counts} />
//       </div>
//       <div className="h-[500px]"></div>
//     </div>
//   );
// };

// export default Product;

import React, { useEffect, useState, useCallback } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import {
  Breadcrumb,
  CardProduct,
  SearchItem,
  InputSelect,
  Pagination,
  Sidebar,
} from "../../components";
import { apiGetProducts } from "../../apis";
import Masonry from "react-masonry-css";
import { sorts } from "../../ultils/contants";
import ProductNotFound from "../../assets/ProductNotFound.png";

const breakpointColumnsObj = {
  default: 3,
  1100: 3,
  700: 2,
  500: 1,
};

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null);
  const [params] = useSearchParams();
  const [sort, setSort] = useState("");
  const { category, brand } = useParams();

  const fetchProducts = async (queries) => {
    if (category && category !== "products") queries.category = category;
    if (brand) queries.brand = brand;
    const response = await apiGetProducts(queries);
    if (response.success) setProducts(response);
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);

    let priceQuery = {};
    for (let i of params) queries[i[0]] = i[1];

    if (queries.to && queries.from) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      };
      delete queries.price;
    } else {
      if (queries.from) queries.price = { gte: queries.from };
      if (queries.to) queries.price = { lte: queries.to };
    }

    delete queries.to;
    delete queries.from;

    const q = {
      ...priceQuery,
      ...queries,
      limit: process.env.REACT_APP_LIMIT || 10,
      page: params.get("page") || 1,
    };

    fetchProducts(q);

    window.scrollTo(0, 0);
  }, [params, category, brand]);

  const ChangeActiveFilter = useCallback(
    (name) => {
      if (activeClick === name) setActiveClick(null);
      else setActiveClick(name);
    },
    [activeClick]
  );

  const changeValue = useCallback((value) => {
    setSort(value);
  }, []);

  useEffect(() => {
    if (sort) {
      navigate({
        pathname: `/products`,
        search: createSearchParams({ sort }).toString(),
      });
    }
  }, [sort, navigate]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 p-4 hidden md:block">
        {" "}
        {/* Hidden on small screens */}
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="w-full md:w-3/4 p-4">
        <div className="h-[50px] flex justify-center items-center p-4 bg-[#F5F5FA]">
          <div className="w-full">
            <Breadcrumb category={category || brand} />
          </div>
        </div>
        <div className="w-full border p-4 flex justify-between mt-8 m-auto">
          <div className="w-4/5 flex flex-col gap-3">
            <span className="font-main text-sm">Filter By</span>
            <div className="flex items-center gap-4">
              <SearchItem
                name="price"
                activeClick={activeClick}
                ChangeActiveFilter={ChangeActiveFilter}
                type="input"
              />
              <SearchItem
                name="color"
                activeClick={activeClick}
                ChangeActiveFilter={ChangeActiveFilter}
              />
            </div>
          </div>
          <div className="w-1/5 mr-3 flex flex-col gap-3">
            <span className="font-main text-sm">Sort By</span>
            <div className="w-full">
              <InputSelect
                changeValue={changeValue}
                value={sort}
                options={sorts}
              />
            </div>
          </div>
        </div>
        {/* <div className="w-full mt-8 m-auto ">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            {products?.productData?.map((el) => (
              <div key={el.id} className="masonry-item overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>
                <CardProduct pid={el._id} productData={el} />
              </div>
            ))}
          </Masonry>
        </div> */}

        <div className="w-full mt-8 m-auto ">
          {products?.productData?.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              {products.productData.map((el) => (
                <div
                  key={el.id}
                  className="masonry-item overflow-hidden"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <CardProduct pid={el._id} productData={el} />
                </div>
              ))}
            </Masonry>
          ) : (
            <div className="text-center flex flex-col items-center justify-center">
              <img
                src={ProductNotFound}
                className="w-[300px] h-auto"
                alt="No products found"
              />
              {/* <span className="text-lg">No products available</span> */}
            </div>
          )}
        </div>

        <div className="m-auto flex justify-end my-4">
          <Pagination totalCount={products?.counts} />
        </div>
      </main>
    </div>
  );
};

export default Product;
