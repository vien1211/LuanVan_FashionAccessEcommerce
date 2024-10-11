// import React, { memo, useState, useEffect } from "react";
// import icons from "../ultils/icons";
// import { colors } from "../ultils/contants";
// import {
//   createSearchParams,
//   useNavigate,
//   useParams,
//   useSearchParams,
// } from "react-router-dom";
// import { apiGetProducts } from "../apis";
// import useDebounce from "../hooks/useDebounce";
// const { FaChevronDown } = icons;

// const SearchItem = ({
//   name,
//   activeClick,
//   ChangeActiveFilter,
//   type = "checkbox",
// }) => {
//   const [selected, setSelected] = useState([]);
//   const [params] = useSearchParams();
//   const [maxPrice, setMaxPrice] = useState(null);
//   const navigate = useNavigate();
//   const { category } = useParams();
//   const [price, setPrice] = useState({
//     from: "",
//     to: "",
//   });

//   const fetchMaxPrice = async () => {
//     try {
//       const response = await apiGetProducts({ sort: "-price", limit: 1 });
//       if (response.success && response.productData.length > 0) {
//         setMaxPrice(response.productData[0]?.price);
//       }
//     } catch (error) {
//       console.error("Error fetching max price:", error);
//     }
//   };

//   const handleSelect = (e) => {
//     const value = e.target.value;
//     setSelected((prev) =>
//       prev.includes(value)
//         ? prev.filter((item) => item !== value)
//         : [...prev, value]
//     );
//   };

//   const handleReset = (e) => {
//     e.stopPropagation();
//     setSelected([]);
//   };

//   useEffect(() => {
//     let param = [];
//     for (let i of params.entries()) param.push(i);
//     const queries = {};
//     for (let i of params) queries[i[0]] = i[1];
//     if (selected.length > 0) {
//       queries.color = selected.join(",");
//       queries.page = 1;
//     } else delete queries.color;

//     navigate({
//       pathname: `/${category}`,
//       search: createSearchParams(queries).toString(),
//     });
//   }, [selected]);




//   useEffect(() => {
//     if (type === "input") fetchMaxPrice();
//   }, [type]);

//   // useEffect(() => {
//   //   if (price.from && price.to && price.from > price.to)
//   //     alert("from price cannot greater then to price");
//   // }, [price]);

//   const debouncePriceFrom = useDebounce(price.from, 500);
//   const debouncePriceTo = useDebounce(price.to, 500);
//   useEffect(() => {
//     let param = [];
//     for (let i of params.entries()) param.push(i);
//     const queries = {};
//     for (let i of params) queries[i[0]] = i[1];
    
//     if (Number(price.from) > 0) queries.from = price.from;
//     else delete queries.from
//     if (Number(price.to) > 0) queries.to = price.to;
//     else delete queries.to

//     queries.page = 1;
//     navigate({
//       pathname: `/${category}`,
//       search: createSearchParams(queries).toString(),
//     });
//   }, [debouncePriceFrom, debouncePriceTo]);

//   return (
//     <div
//       className="h-[41px] p-4 rounded-md shadow-md border cursor-pointer text-xs text-gray-500 gap-4 relative flex justify-between items-center"
//       onClick={() => ChangeActiveFilter(name)}
//     >
//       <span className="capitalize">{name}</span>
//       <FaChevronDown />
//       {activeClick === name && (
//         <div className="absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]">
//           {type === "checkbox" && (
//             <div>
//               <div className="p-4 items-center flex justify-between gap-8 border-b">
//                 <span className="whitespace-nowrap">{`${selected.length} selected`}</span>
//                 <span
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelected([]);
//                   }}
//                   className="underline cursor-pointer hover:text-main"
//                 >
//                   Reset
//                 </span>
//               </div>
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 className="flex flex-col gap-3 mt-4"
//               >
//                 {colors.map((el, index) => (
//                   <div key={index} className="flex items-center gap-4">
//                     <input
//                       type="checkbox"
//                       value={el}
//                       checked={selected.includes(el)}
//                       onChange={handleSelect}
//                       id={el}
//                       className="form-checkbox"
//                     />
//                     <label className="capitalize text-gray-700" htmlFor={el}>
//                       {el}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           {type === "input" && (
//             <div onClick={(e) => e.stopPropagation()}>
//               <div className="p-4 items-center flex justify-between gap-8 border-b">
//                 <span className="whitespace-nowrap">{`The highest price is ${Number(
//                   maxPrice
//                 ).toLocaleString()} VNĐ `}</span>
//                 <span
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setPrice({ from: "", to: "" });
//                   }}
//                   className="underline cursor-pointer hover:text-main"
//                 >
//                   Reset
//                 </span>
//               </div>
//               <div className="flex items-center p-2 gap-2">
//                 <div className="flex items-center gap-2">
//                   <label htmlFor="from">From</label>
//                   <input
//                     className="form-input"
//                     type="number"
//                     id="from"
//                     value={price.from}
//                     onChange={(e) =>
//                       setPrice((prev) => ({ ...prev, from: e.target.value }))
//                     }
//                   />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <label htmlFor="to">To</label>
//                   <input
//                     className="form-input"
//                     type="number"
//                     id="to"
//                     value={price.to}
//                     onChange={(e) =>
//                       setPrice((prev) => ({ ...prev, to: e.target.value }))
//                     }
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default memo(SearchItem);


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

const { FaChevronDown } = icons;

const SearchItem = ({ name, activeClick, ChangeActiveFilter, type = "checkbox" }) => {
  const [selected, setSelected] = useState([]);
  const [params] = useSearchParams();
  const [maxPrice, setMaxPrice] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 0]); // Dùng để lưu khoảng giá được chọn
  const navigate = useNavigate();
  const { category } = useParams();

  const fetchMaxPrice = async () => {
    try {
      const response = await apiGetProducts({ sort: "-price", limit: 1 });
      if (response.success && response.productData.length > 0) {
        const maxPriceValue = response.productData[0]?.price;
        setMaxPrice(maxPriceValue);
        setPriceRange([0, maxPriceValue]); // Đặt khoảng giá ban đầu
      }
    } catch (error) {
      console.error("Error fetching max price:", error);
    }
  };

  const handleSelect = (e) => {
    const value = e.target.value;
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setSelected([]);
    setPriceRange([0, maxPrice]); // Reset lại thanh trượt về giá trị ban đầu
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

  // Debounce để tránh gọi API quá nhiều lần khi di chuyển thanh trượt
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
    <div
      className="h-[41px] p-4 rounded-md shadow-md border cursor-pointer text-xs text-gray-500 gap-4 relative flex justify-between items-center"
      onClick={() => ChangeActiveFilter(name)}
    >
      <span className="capitalize">{name}</span>
      <FaChevronDown />
      {activeClick === name && (
        <div className="absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]">
          {type === "checkbox" && (
            <div>
              <div className="p-4 items-center flex justify-between gap-8 border-b">
                <span className="whitespace-nowrap">{`${selected.length} selected`}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected([]);
                  }}
                  className="underline cursor-pointer hover:text-main"
                >
                  Reset
                </span>
              </div>
              <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-3 mt-4">
                {colors.map((el, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      value={el}
                      checked={selected.includes(el)}
                      onChange={handleSelect}
                      id={el}
                      className="form-checkbox"
                    />
                    <label className="capitalize text-gray-700" htmlFor={el}>
                      {el}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {type === "input" && (
            <div onClick={(e) => e.stopPropagation()}>
              <div className="p-4 items-center flex justify-between gap-8 border-b">
                <span className="whitespace-nowrap">{`Highest price is ${Number(maxPrice).toLocaleString()} VNĐ`}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setPriceRange([0, maxPrice]);
                  }}
                  className="underline cursor-pointer hover:text-main"
                >
                  Reset
                </span>
              </div>
              <div className="p-4">
                <Slider
                  range
                  min={0}
                  max={maxPrice || 1000000} 
                  value={priceRange}
                  onChange={(values) => setPriceRange(values)} 
                  step={1000}
                  className=""
                />
                <div className="flex justify-between mt-4 text-sm">
                  <span>{`${priceRange[0].toLocaleString()} VNĐ`}</span>
                  <span>{`${priceRange[1].toLocaleString()} VNĐ`}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SearchItem);
