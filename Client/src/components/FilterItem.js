

import React, { memo, useState, useEffect } from "react";
import icons from "../ultils/icons";
import { colors } from "../ultils/contants";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { apiGetProducts } from "../apis";
import useDebounce from "../hooks/useDebounce";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const FilterItem = ({ name, type = "checkbox" }) => {
  const [selected, setSelected] = useState([]);
  const [params] = useSearchParams();
  const [maxPrice, setMaxPrice] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const navigate = useNavigate();
  const { category } = useParams();

  const fetchMaxPrice = async () => {
    try {
      const response = await apiGetProducts({ sort: "-price", limit: 1 });
      if (response.success && response.productData.length > 0) {
        const maxPriceValue = response.productData[0]?.price;
        setMaxPrice(maxPriceValue);
        setPriceRange([0, maxPriceValue]);
      }
    } catch (error) {
      console.error("Error fetching max price:", error);
    }
  };

  const handleSelect = (e) => {
    const value = e.target.value;
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleReset = () => {
    setSelected([]);
    setPriceRange([0, maxPrice]);
  };

  useEffect(() => {
    let param = [];
    for (let i of params.entries()) param.push(i);
    const queries = {};
    for (let i of params) queries[i[0]] = i[1];
    if (selected.length > 0) {
      queries.color = selected.join(",");
      queries.page = 1;
    } else delete queries.color;

    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  }, [selected]);

  useEffect(() => {
    if (type === "input") fetchMaxPrice();
  }, [type]);

  // Debounced values for price range
  const debouncePriceFrom = useDebounce(priceRange[0], 500);
  const debouncePriceTo = useDebounce(priceRange[1], 500);

  useEffect(() => {
    let param = [];
    for (let i of params.entries()) param.push(i);
    const queries = {};
    for (let i of params) queries[i[0]] = i[1];

    if (Number(priceRange[0]) > 0) queries.from = priceRange[0];
    else delete queries.from;
    if (Number(priceRange[1]) > 0) queries.to = priceRange[1];
    else delete queries.to;

    queries.page = 1;
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  }, [debouncePriceFrom, debouncePriceTo]);

  return (
    <div className="flex flex-col">
      <div className="mt-6 flex items-center justify-between gap-2 rounded-tr-[20px] rounded-tl-[20px] text-[20px] font-semibold px-6 py-3 border-t border-l border-r border-main border-opacity-40  text-main bg-[#f2f7f4] text-center">
        Filter By Price
      </div>
      <div className="h-auto p-4 shadow-md rounded-br-[20px] rounded-bl-[20px] border border-main border-opacity-40 text-xs text-gray-500 gap-4 relative flex flex-col">
        <div className="px-2">
          <span className="capitalize text-[13px]">{`Highest price is ${Number(
            maxPrice
          ).toLocaleString()} VNĐ`}</span>
          <div className="mt-4">
            <Slider
              range
              min={0}
              max={maxPrice || 1000000}
              value={priceRange}
              onChange={(values) => setPriceRange(values)}
              step={1000}
              styles={{
                track: { backgroundColor: '#6d8777' },
                handle: { borderColor: '#6d8777', backgroundColor: '#ffffff' }
              }}
            />
            <div className="flex justify-between mt-4 text-sm">
              <span>{`${priceRange[0].toLocaleString()} VNĐ`}</span>
              <span>{`${priceRange[1].toLocaleString()} VNĐ`}</span>
            </div>
          </div>
          <button
            onClick={() => setPriceRange([0, maxPrice])}
            className="bg-slate-100 px-2 py-1 rounded-md mt-3 cursor-pointer text-main hover:bg-[#f2f7f4]"
          >
            Reset Price
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-2 rounded-tr-[20px] rounded-tl-[20px] text-[20px] font-semibold px-6 py-3 border-t border-l border-r border-main border-opacity-40  text-main bg-[#f2f7f4]">
        Filter By Color
      </div>
      <div className="h-auto p-4 shadow-md rounded-br-[20px] rounded-bl-[20px] border border-main border-opacity-40 text-[14px] text-gray-500 gap-4 relative flex flex-col">
        <div className="px-4">
          <div className=" flex flex-col gap-3">
            {colors
              .slice()
              .sort((a,b) => a.localeCompare(b))
              .map((el, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="checkbox"
                  value={el}
                  checked={selected.includes(el)}
                  onChange={handleSelect}
                  id={el}
                  className="form-checkbox text-main checked:bg-main focus:ring-main"
                />
                <label className="capitalize text-gray-700" htmlFor={el}>
                  {el}
                </label>
              </div>
            ))}
          </div>
          <button
            onClick={handleReset}
            className="bg-slate-100 text-[12px] px-2 py-1 rounded-md mt-3 cursor-pointer text-main hover:bg-[#f2f7f4]"
          >
            Reset Colors
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(FilterItem);



