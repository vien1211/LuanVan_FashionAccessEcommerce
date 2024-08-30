import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Breadcrumb, CardProduct, InputSelect, Pagination, SearchItem } from "../../components";
import { apiGetProducts } from "../../apis";
import Masonry from "react-masonry-css";
import { colors, sorts } from '../../ultils/contants';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null);
  const [params] = useSearchParams();
  const [sort, setSort] = useState('');
  const [filters, setFilters] = useState({
    priceRange: '',
    color: '',
    // Add other filter criteria as needed
  });

  const fetchProducts = async (queries) => {
    const response = await apiGetProducts(queries);
    if (response.success) setProducts(response);
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);

    
    if (sort) queries.sort = sort; // Add sort query
    if (filters.priceRange) queries.priceRange = filters.priceRange; // Add price range filter
    if (filters.color) queries.color = filters.color; // Add color filter
    const q = {
      ...queries,
      limit: process.env.REACT_APP_LIMIT || 10,
      page: params.get("page") || 1,
    };

    fetchProducts(q);
    
  }, [params, sort, filters]);

  const changeValue = useCallback((value) => {
    setSort(value);
  }, []);

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const ChangeActiveFilter = useCallback(
    (name) => {
      if (activeClick === name) setActiveClick(null);
      else setActiveClick(name);
    },
    [activeClick]
  );

  return (
    <div>
      <div className="h-[50px] flex justify-center items-center p-4 bg-[#F5F5FA]">
        <div className="w-main">
          <Breadcrumb  />
        </div>
      </div>

      {/* Sorting and Filtering UI */}
      <div className="flex justify-between items-center my-4">
      <div className="w-4/5 flex flex-col gap-3">
          <span className="font-main text-sm">Filter By</span>
          <div className="flex items-center gap-4">
          
          </div>
        </div>
        <div className="w-1/5 flex flex-col gap-3">
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

      {products?.productData?.length > 0 ? (
        <Masonry
          breakpointCols={{
            default: 4,
            1100: 3,
            700: 2,
            500: 1,
          }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {products.productData.map((product) => (
            <CardProduct key={product.id} pid={product.id} productData={product} />
          ))}
        </Masonry>
      ) : (
        <div>No products available</div>
      )}
      <div className="m-auto flex justify-end my-4">
        <Pagination totalCount={products?.counts} />
      </div>

      <div className="h-[100px]">
       
      </div>
    </div>
  );
};

export default ProductList;
