// import React, { useCallback, useEffect, useState } from "react";
// import { InputField } from "../../components";
// import { useSearchParams } from "react-router-dom";
// import Swal from "sweetalert2";
// import { apiGetStock } from "../../apis";
// import useDebounce from "../../hooks/useDebounce";
// import { useForm } from "react-hook-form";
// import * as XLSX from "xlsx";
// import { HiOutlineArrowDownTray } from "react-icons/hi2";

// const Stock = () => {
//   const {
//     handleSubmit,
//     register,
//     formState: { errors },
//     reset,
//   } = useForm({});
//   const [q, setQ] = useState("");
//   const [inventory, setInventory] = useState(null);
//   const [params] = useSearchParams();
//   const [counts, setCounts] = useState(0);
//   const queriesDebounce = useDebounce(q, 800);

//   const setValue = useCallback(
//     (value) => {
//       setQ(value);
//     },
//     [q]
//   );

//   const fetchStock = async (params) => {
//     try {
//       const response = await apiGetStock({
//         ...params,
//         limit: process.env.REACT_APP_LIMIT,
//       });
//       if (response.success) {
//         setCounts((prev) => ({
//           ...prev,
//           totalQuantity: response.totalQuantity,
//         }));
//         setInventory(response.Stock);
//       } else {
//         console.error(response.message);
//         Swal.fire("Error", response.message, "error");
//       }
//     } catch (error) {
//       console.error("An error occurred:", error);
//       Swal.fire("Error", "Failed to fetch Supplier.", "error");
//     }
//   };

//   useEffect(() => {
//     const queries = Object.fromEntries([...params]);

//     if (queriesDebounce) {
//       queries.q = queriesDebounce;
//     } else {
//       delete queries.q;
//     }

//     fetchStock(queries);
//   }, [queriesDebounce, params]);

//   const handleExportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       inventory.map((item) => ({
//           "Product Name": item.product?.title || "Unknown Product",
//           Category: item.category,
//           Brand: item.brand,
//           Color: item.color,
//           "Inventory Quantity": item.quantity,
          
//       }))
//     );

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
//     XLSX.writeFile(workbook, "Inventory.xlsx");
//   };

//   return (
//     <div className="w-full p-4 my-4">
//       <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
//         <h1>Inventory</h1>
//         <button
//             onClick={handleExportToExcel}
//             className="flex ml-auto gap-2 bg-[#6D8777] text-white text-sm font-light px-4 py-2 rounded-full shadow-md hover:bg-[#405c3e]"
//           >
//             <HiOutlineArrowDownTray size={20} className=""/>
//             Export Excel
//           </button>
//       </div>

//       <div className="py-2 w-full overflow-x-auto">
//         <div className="flex justify-end py-2 px-2">
//           <InputField
//             nameKey={"Search..."}
//             value={q}
//             setValue={setValue}
//             style={"w-[350px] shadow-md"}
//           />
//         </div>

//         <table className="table-auto w-full mb-6 text-left min-w-[1000px]">
//           <thead className="font-bold bg-[#273526] text-white text-[13px]">
//             <tr>
//               <th className="px-2 py-2">#</th>
//               <th className="px-2 py-2">Product</th>
//               <th className="px-2 py-2">Category</th>
//               <th className="px-2 py-2">Brand</th>
//               <th className="px-2 py-2">Color</th>
//               <th className="px-2 py-2">Inventory Quantity</th>
//             </tr>
//           </thead>

//           <tbody>
//             {inventory?.map((el, index) => (
//               <tr
//                 key={el._id}
//                 className={`border-y-main text-[13px] ${
//                   index % 2 === 0 ? "bg-white" : "bg-gray-200"
//                 }`}
//               >
//                 <td className="px-2 py-2">
//                   {((+params.get("page") || 1) - 1) *
//                     process.env.REACT_APP_LIMIT +
//                     index +
//                     1}
//                 </td>
//                 <td className="px-2 py-2">{el.product?.title }</td>
//                 <td className="px-2 py-2">{el.product?.category || "N/A"}</td>
//                 <td className="px-2 py-2">{el.product?.brand || "N/A"}</td>
//                 <td className="px-2 py-2">{el?.color || "N/A"}</td>
//                 <td className="px-2 py-2">{el?.quantity || "0"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Stock;


import React, { useCallback, useEffect, useState } from "react";
import { InputField } from "../../components";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { apiGetStock } from "../../apis";
import useDebounce from "../../hooks/useDebounce";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import { HiOutlineArrowDownTray } from "react-icons/hi2";

const Stock = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({});
  const [q, setQ] = useState("");
  const [inventory, setInventory] = useState([]);
  const [params] = useSearchParams();
  const [totalQuantity, setTotalQuantity] = useState(0); // State for total quantity
  const queriesDebounce = useDebounce(q, 800);

  const setValue = useCallback(
    (value) => {
      setQ(value);
    },
    [q]
  );

  const fetchStock = async (params) => {
    try {
      const response = await apiGetStock({
        ...params,
        limit: process.env.REACT_APP_LIMIT,
      });
      if (response.success) {
        const totalQty = response.Stock.reduce((sum, item) => sum + item.quantity, 0); // Calculate total quantity
        setTotalQuantity(totalQty); // Update total quantity state
        setInventory(response.Stock);
      } else {
        console.error(response.message);
        Swal.fire("Error", response.message, "error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire("Error", "Failed to fetch Supplier.", "error");
    }
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);

    if (queriesDebounce) {
      queries.q = queriesDebounce;
    } else {
      delete queries.q;
    }

    fetchStock(queries);
  }, [queriesDebounce, params]);

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      inventory.map((item) => ({
        "Product Name": item.product?.title || "Unknown Product",
        Category: item.category,
        Brand: item.brand,
        Color: item.color,
        "Inventory Quantity": item.quantity,
      }))
    );

    // Add total quantity row
    const totalRow = [{ "Product Name": "Total", "Inventory Quantity": totalQuantity }];
    const totalSheet = XLSX.utils.json_to_sheet(totalRow, { header: ["Product Name", "Inventory Quantity"] });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.utils.book_append_sheet(workbook, totalSheet, "Total Quantity"); // Add total quantity sheet
    XLSX.writeFile(workbook, "Inventory.xlsx");
  };

  return (
    <div className="w-full p-4 my-4">
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>Inventory</h1>
        <button
          onClick={handleExportToExcel}
          className="flex ml-auto gap-2 bg-[#6D8777] text-white text-sm font-light px-4 py-2 rounded-full shadow-md hover:bg-[#405c3e]"
        >
          <HiOutlineArrowDownTray size={20} />
          Export Excel
        </button>
      </div>

      <div className="flex justify-between items-center py-4">
        <div className="px-4">Total Quantity In Stock: <strong>{totalQuantity}</strong></div> {/* Display total quantity */}
        <div className="flex justify-end py-2 px-2">
          <InputField
            nameKey={"Search..."}
            value={q}
            setValue={setValue}
            style={"w-[350px] shadow-md"}
          />
        </div>
      </div>

      <div className="py-2 w-full overflow-x-auto">
        <table className="table-auto w-full mb-6 text-left min-w-[1000px]">
          <thead className="font-bold bg-[#273526] text-white text-[13px]">
            <tr>
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">Product</th>
              <th className="px-2 py-2">Category</th>
              <th className="px-2 py-2">Brand</th>
              <th className="px-2 py-2">Color</th>
              <th className="px-2 py-2">Inventory Quantity</th>
            </tr>
          </thead>

          <tbody>
            {inventory?.map((el, index) => (
              <tr
                key={el._id}
                className={`border-y-main text-[13px] ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-200"
                }`}
              >
                <td className="px-2 py-2">
                  {((+params.get("page") || 1) - 1) *
                    process.env.REACT_APP_LIMIT +
                    index +
                    1}
                </td>
                <td className="px-2 py-2">{el.product?.title}</td>
                <td className="px-2 py-2">{el.product?.category || "N/A"}</td>
                <td className="px-2 py-2">{el.product?.brand || "N/A"}</td>
                <td className="px-2 py-2">{el?.color || "N/A"}</td>
                <td className="px-2 py-2">{el?.quantity || "0"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;
