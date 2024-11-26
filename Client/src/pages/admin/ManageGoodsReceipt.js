import React, { useCallback, useEffect, useState } from "react";
import { InputField, Pagination } from "../../components";
import { useSearchParams } from "react-router-dom";
import { apiGetReceipts } from "../../apis";
import Swal from "sweetalert2";
import useDebounce from "../../hooks/useDebounce";
import { formatMoney } from "../../ultils/helper";
import moment from "moment";

const ManageGoodsReceipt = () => {
  const [receipt, setReceipt] = useState(null);
  const [params] = useSearchParams();
  const [q, setQ] = useState("");
  const [counts, setCounts] = useState(0);
  const queriesDebounce = useDebounce(q, 800);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchReceipt = async (params) => {
    try {
      const response = await apiGetReceipts({
        ...params,
        startDate,
        endDate,
        limit: process.env.REACT_APP_LIMIT,
      });
      if (response.success) {
        setReceipt(response.receipts);
        setCounts(response.counts);
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

    fetchReceipt(queries);
  }, [queriesDebounce, params, startDate, endDate]);

  const setValue = useCallback(
    (value) => {
      setQ(value);
    },
    [q]
  );

  return (
    <div className="w-full p-4 my-4">
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>Manage Goods Receipt</h1>
      </div>

      <div className="py-2 w-full overflow-x-auto">
        <div className="flex items-end justify-between px-6 py-6">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium mr-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium mr-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
          </div>
          <div className="-mb-2">
            <InputField
              nameKey={"Search..."}
              value={q}
              setValue={setValue}
              style={"w-[350px] shadow-md"}
            />
          </div>
        </div>

        <table className="table-auto w-full mb-6 text-left min-w-[1000px]">
          <thead className="font-bold bg-[#273526] text-white text-[13px]">
            <tr>
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">Supplier</th>
              <th className="px-2 py-2">Products</th>
              <th className="px-2 py-2">Total Amount</th>
              <th className="px-2 py-2">Date Of Entry</th>
            </tr>
          </thead>
          <tbody>
            {receipt?.map((el, index) => (
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
                <td className="px-2 py-2">{el.supplier.name || "N/A"}</td>
                <td className="px-2 py-2">
                  <span className="flex flex-col">
                    {el.products?.map((item) => (
                      <span key={item._id} className="py-2">
                        <span className="flex flex-col mt-2">
                          <span className="text-main text-sm font-semibold">
                            {item.product?.title}
                          </span>

                          <span className="gap-2 font-light flex items-center">
                            <span>Color: </span>
                            <span>{item.color}</span>
                          </span>
                          <span className="gap-2 font-light flex items-center">
                            <span>Import Quantity: </span>
                            <span>{item.quantity}</span>
                          </span>

                          <span className="gap-2 font-light flex items-center">
                            <span>Import Unit Price: </span>
                            <span>{`${formatMoney(item.price)} VNĐ`}</span>
                          </span>
                        </span>
                      </span>
                    ))}
                  </span>
                </td>
                <td className="px-2 py-2">{`${formatMoney(
                  el?.totalAmount
                )} VNĐ`}</td>
                <td className="px-2 py-2">
                  {moment(el.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex w-full px-4">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageGoodsReceipt;
