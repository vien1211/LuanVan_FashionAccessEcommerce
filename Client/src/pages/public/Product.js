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
  DealDaily,
  FilterItem,
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

  // useEffect(() => {
  //   const queries = Object.fromEntries([...params]);

  //   let priceQuery = {};
  //   for (let i of params) queries[i[0]] = i[1];

  //   if (queries.to && queries.from) {
  //     priceQuery = {
  //       $and: [
  //         { price: { gte: queries.from } },
  //         { price: { lte: queries.to } },
  //       ],
  //     };
  //     delete queries.price;
  //   } else {
  //     if (queries.from) queries.price = { gte: queries.from };
  //     if (queries.to) queries.price = { lte: queries.to };
  //   }

  //   delete queries.to;
  //   delete queries.from;

  //   const q = {
  //     ...priceQuery,
  //     ...queries,
  //     limit: process.env.REACT_APP_LIMIT || 10,
  //     page: params.get("page") || 1,
  //   };

  //   fetchProducts(q);

  //   window.scrollTo(0, 0);
  // }, [params, category, brand]);

  useEffect(() => {
    const queries = Object.fromEntries([...params]);

    let priceQuery = {};

    // Convert 'from' and 'to' params to numbers
    if (queries.from) queries.from = Number(queries.from);
    if (queries.to) queries.to = Number(queries.to);

    // Handle price range queries
    if (queries.to && queries.from) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      };
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
        <FilterItem
          activeClick={activeClick}
          ChangeActiveFilter={ChangeActiveFilter}
          type="input"
        />
        <DealDaily />
      </aside>

      {/* Main Content Area */}
      <main className="w-full md:w-3/4 p-4">
        <div className="h-[50px] flex justify-center items-center p-4 bg-[#F2F7F4] rounded-lg">
          <div className="w-full">
            <Breadcrumb category={category || brand} />
          </div>
        </div>
        <div className="w-full border border-main border-opacity-40 rounded-[20px] px-6 py-4 flex justify-between mt-8 m-auto">
          <div className="w-4/5 flex flex-col gap-3">
            <span className="font-main text-sm">Search Item</span>
            <div className=" flex items-center gap-4">
              {/* <FilterItem
                name="price"
                activeClick={activeClick}
                ChangeActiveFilter={ChangeActiveFilter}
                type="input"
              />
              <FilterItem
                name="color"
                activeClick={activeClick}
                ChangeActiveFilter={ChangeActiveFilter}
              /> */}
              <SearchItem
                activeClick={activeClick}
                ChangeActiveFilter={ChangeActiveFilter}
                type="input"
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
                  className="masonry-item overflow-hidden hover:scale-105 duration-500"
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
