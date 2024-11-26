// import React, { useState, useEffect } from "react";

// import { apiGetMonthlyProfit, apiGetProfit } from "../../apis";
// import { formatMoney } from "../../ultils/helper";
// import { RiMoneyDollarCircleLine } from "react-icons/ri";
// import * as XLSX from "xlsx";
// import { HiOutlineArrowDownTray } from "react-icons/hi2";

// const MonthlyProfitTable = () => {
//   const [monthlyProfit, setMonthlyProfit] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [years, setYears] = useState([]);
//   const [counts, setCounts] = useState([]);

//   // Fetch data from API
//   const fetchMonthlyProfit = async () => {
//     const response = await apiGetMonthlyProfit();
//     if (response.success) {
//       const profitData = response.monthlyProfit.map((item) => ({
//         month: item._id.month,
//         year: item._id.year,
//         totalRevenue: item.totalRevenue,
//         totalCost: item.totalCost,
//         profit: item.profit,
//       }));

//       // Lấy danh sách các năm
//       const yearList = [...new Set(profitData.map((item) => item.year))];
//       setYears(yearList);

//       setMonthlyProfit(profitData);
//     }
//   };

//   const fetchProfit = async () => {
//     const response = await apiGetProfit();
//     if (response.success) {
//       setCounts((prev) => ({
//         ...prev,
//         profit: response.profit,
//         totalRevenue: response.totalRevenue,
//         totalCost: response.totalCost,
//       }));
//     }
//   };

//   useEffect(() => {
//     fetchMonthlyProfit();
//     fetchProfit();
//   }, []);

//   // Lọc dữ liệu theo năm đã chọn
//   const filteredData = monthlyProfit.filter(
//     (item) => item.year === selectedYear
//   );

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       filteredData.map((item) => ({
//         Month: `Tháng ${item.month}`,
//         "Total Revenue": `${formatMoney(item.totalRevenue)} VNĐ`,
//         "Total Cost": `${formatMoney(item.totalCost)} VNĐ`,
//         Profit: `${formatMoney(item.profit)} VNĐ`,
//       }))
//     );

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Profit");
//     XLSX.writeFile(workbook, `Monthly_Profit_${selectedYear}.xlsx`);
//   };

//   return (
//     <div className="w-full p-4 my-4">
//       <div className="grid grid-cols-3 gap-4 p-4">
//         <div className="bg-[#273526] p-6 rounded-[16px] shadow-md flex flex-col">
//           <div className="flex gap-2">
//             <RiMoneyDollarCircleLine size={32} className="text-[#afac86]" />
//             <h2 className="text-lg font-semibold text-[#afac86]">
//               Total Profit
//             </h2>
//           </div>
//           <p className="py-2 text-2xl font-bold text-white">
//             {counts.profit ? formatMoney(counts.profit) : "0"}{" "}
//             <span className="text-[#afac86] text-xl">VNĐ</span>
//           </p>
//         </div>

//         <div className="bg-[#273526] p-6 rounded-[16px] shadow-md flex flex-col">
//           <div className="flex gap-2">
//             <RiMoneyDollarCircleLine size={32} className="text-[#8daf86]" />
//             <h2 className="text-lg font-semibold text-[#8daf86]">
//               Total Revenue
//             </h2>
//           </div>
//           <p className="py-2 text-2xl font-bold text-white">
//             {counts.totalRevenue ? formatMoney(counts.totalRevenue) : "0"}{" "}
//             <span className="text-[#8daf86] text-xl">VNĐ</span>
//           </p>
//         </div>

//         <div className="bg-[#273526] p-6 rounded-[16px] shadow-md flex flex-col">
//           <div className="flex gap-2">
//             <RiMoneyDollarCircleLine size={32} className="text-[#af9886]" />
//             <h2 className="text-lg font-semibold text-[#af9886]">Total Cost</h2>
//           </div>
//           <p className="py-2 text-2xl font-bold text-white">
//             {counts.totalCost ? formatMoney(counts.totalCost) : "0"}{" "}
//             <span className="text-[#af9886] text-xl">VNĐ</span>
//           </p>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded-[20px] shadow-md my-6">
//         {/* Dropdown chọn năm */}
//         <div className=" p-2 flex justify-between items-center">
//           <label className="text-lg font-semibold">Select Year</label>
//           <button
//             className="flex gap-2 bg-[#6D8777] text-white text-sm font-light px-4 py-2 rounded-full shadow-md hover:bg-[#405c3e]"
//             onClick={exportToExcel}
//           >
//             <HiOutlineArrowDownTray size={20} />
//             Export to Excel
//           </button>
//         </div>
//         <select
//           className="p-2 mx-2 mb-4 border border-gray-300 rounded-lg"
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(Number(e.target.value))}
//         >
//           {years.map((year) => (
//             <option key={year} value={year}>
//               {year}
//             </option>
//           ))}
//         </select>

//         {/* Hiển thị bảng dữ liệu */}
//         <table className="table-auto w-full text-left mb-2">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="px-4 py-2">Month</th>
//               <th className="px-4 py-2">Total Revenue (VNĐ)</th>
//               <th className="px-4 py-2">Total Cost (VNĐ)</th>
//               <th className="px-4 py-2">Profit (VNĐ)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((item, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="px-4 py-2">{`Tháng ${item.month}`}</td>
//                   <td className="px-4 py-2">
//                     {formatMoney(item.totalRevenue)} VNĐ
//                   </td>
//                   <td className="px-4 py-2">
//                     {formatMoney(item.totalCost)} VNĐ
//                   </td>
//                   <td className="px-4 py-2">{formatMoney(item.profit)} VNĐ</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td className="px-4 py-2" colSpan="4">
//                   No data available for {selectedYear}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MonthlyProfitTable;




import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { apiGetMonthlyProfit, apiGetProfit } from "../../apis";
import { formatCurrencyShort, formatMoney } from "../../ultils/helper";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import * as XLSX from "xlsx";
import { HiOutlineArrowDownTray } from "react-icons/hi2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlyProfitTable = () => {
  const [monthlyProfit, setMonthlyProfit] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(0); // 0 để hiển thị tất cả tháng
  const [years, setYears] = useState([]);
  const [counts, setCounts] = useState({});

  // Fetch data từ API
  const fetchMonthlyProfit = async () => {
    const response = await apiGetMonthlyProfit();
    if (response.success) {
      const profitData = response.monthlyProfit.map((item) => ({
        month: item._id.month,
        year: item._id.year,
        totalRevenue: item.totalRevenue,
        totalCost: item.totalCost,
        profit: item.profit,
      }));

      // Lấy danh sách các năm
      const yearList = [...new Set(profitData.map((item) => item.year))];
      setYears(yearList);

      setMonthlyProfit(profitData);
    }
  };

  const fetchProfit = async () => {
    const response = await apiGetProfit();
    if (response.success) {
      setCounts({
        profit: response.profit,
        totalRevenue: response.totalRevenue,
        totalCost: response.totalCost,
      });
    }
  };

  useEffect(() => {
    fetchMonthlyProfit();
    fetchProfit();
  }, []);

  // Lọc dữ liệu theo năm và tháng đã chọn
  const filteredData = monthlyProfit
    .filter(
      (item) =>
        item.year === selectedYear &&
        (selectedMonth === 0 || item.month === selectedMonth)
    )
    .sort((a, b) => a.month - b.month);

    const chartOptions = {
      plugins: {
        legend: {
          position: "top", // Vị trí chú thích (legend)
        },
       
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatCurrencyShort(value);
            },
          },
        },
      },
      maintainAspectRatio: false,
    };

    const containerStyle = {
      width: "700px", // Đặt chiều rộng mong muốn
      height: "450px"
     
    };

  // Dữ liệu biểu đồ
  const chartData = {
    labels: filteredData.map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: "Revenue",
        data: filteredData.map((item) => item.totalRevenue),
        borderColor: "#8daf86",
        backgroundColor: "#8daf86",
        tension: 0.5,
      },
      {
        label: "Cost",
        data: filteredData.map((item) => item.totalCost),
        borderColor: "#af9886",
        backgroundColor: "#af9886",
        tension: 0.5,
      },
      {
        label: "Profit",
        data: filteredData.map((item) => item.profit),
        borderColor: "#afac86",
        backgroundColor: "#afac86",
        tension: 0.5,
      },
    ],
  };

  const renderChart = () => {
    if (selectedMonth === 0) {
      // All months: Line chart
      return <Line data={chartData} options={chartOptions} style={containerStyle}/>;
    } else {
      // Specific month: Bar chart
      return <Bar data={chartData} options={chartOptions} style={containerStyle}/>;
    }
  };


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        Month: `Tháng ${item.month}`,
        "Total Revenue": `${formatMoney(item.totalRevenue)} VNĐ`,
        "Total Cost": `${formatMoney(item.totalCost)} VNĐ`,
        Profit: `${formatMoney(item.profit)} VNĐ`,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Profit");
    XLSX.writeFile(workbook, `Monthly_Profit_${selectedYear}.xlsx`);
  };

  return (
    <div className="w-full p-4 my-4">
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-[#273526] p-6 rounded-[16px] shadow-md flex flex-col">
          <div className="flex gap-2">
            <RiMoneyDollarCircleLine size={32} className="text-[#afac86]" />
            <h2 className="text-lg font-semibold text-[#afac86]">Total Profit</h2>
          </div>
          <p className="py-2 text-2xl font-bold text-white">
            {counts.profit ? formatMoney(counts.profit) : "0"} <span className="text-[#afac86] text-xl">VNĐ</span>
          </p>
        </div>

        <div className="bg-[#273526] p-6 rounded-[16px] shadow-md flex flex-col">
          <div className="flex gap-2">
            <RiMoneyDollarCircleLine size={32} className="text-[#8daf86]" />
            <h2 className="text-lg font-semibold text-[#8daf86]">Total Revenue</h2>
          </div>
          <p className="py-2 text-2xl font-bold text-white">
            {counts.totalRevenue ? formatMoney(counts.totalRevenue) : "0"} <span className="text-[#8daf86] text-xl">VNĐ</span>
          </p>
        </div>

        <div className="bg-[#273526] p-6 rounded-[16px] shadow-md flex flex-col">
          <div className="flex gap-2">
            <RiMoneyDollarCircleLine size={32} className="text-[#af9886]" />
            <h2 className="text-lg font-semibold text-[#af9886]">Total Cost</h2>
          </div>
          <p className="py-2 text-2xl font-bold text-white">
            {counts.totalCost ? formatMoney(counts.totalCost) : "0"} <span className="text-[#af9886] text-xl">VNĐ</span>
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[20px] shadow-md p-6">
        {/* Dropdown chọn năm và tháng */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
            <span className="font-semibold">
              Select Month
                </span>
          <select
              className="p-2 border border-gray-300 rounded-lg"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              <option value={0}>All Months</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {`Tháng ${i + 1}`}
                </option>
              ))}
            </select>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-semibold">
              Select Year
                </span>
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            </div>

            
          </div>

          <button
            className="flex gap-2 bg-[#6D8777] text-white text-sm font-light px-4 py-2 rounded-full shadow-md hover:bg-[#405c3e]"
            onClick={exportToExcel}
          >
            <HiOutlineArrowDownTray size={20} />
            Export to Excel
          </button>
        </div>

        {/* Bảng dữ liệu */}
        <table className="table-auto w-full text-left mb-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Month</th>
              <th className="px-4 py-2">Total Revenue (VNĐ)</th>
              <th className="px-4 py-2">Total Cost (VNĐ)</th>
              <th className="px-4 py-2">Profit (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{`Tháng ${item.month}`}</td>
                  <td className="px-4 py-2">
                    {formatMoney(item.totalRevenue)} VNĐ
                  </td>
                  <td className="px-4 py-2">
                    {formatMoney(item.totalCost)} VNĐ
                  </td>
                  <td className="px-4 py-2">{formatMoney(item.profit)} VNĐ</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-2 text-center" colSpan={4}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Hiển thị biểu đồ */}
        <div className="flex mx-auto w-[800px] p-6">{renderChart()}</div>
      </div>
    </div>
  );
};

export default MonthlyProfitTable;
