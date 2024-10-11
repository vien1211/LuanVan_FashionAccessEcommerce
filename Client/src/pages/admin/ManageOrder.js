import React, { useEffect, useState } from "react";
import { apiGetOrderByAdmin, apiUpdateOrderStatus } from "../../apis";
import { CustomSelect, InputForm, Pagination } from "../../components";
import { useForm } from "react-hook-form";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { statusOrder } from "../../ultils/contants";
import moment from "moment";
import { formatMoney } from "../../ultils/helper";



const ManageOrder = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const q = watch("q");
  const status = watch("status");
  const navigate = useNavigate();
  const location = useLocation();
  const [counts, setCounts] = useState(0);
  const [orders, setOrders] = useState([]);
  const [params] = useSearchParams();
  const [editEl, setEditEl] = useState(null);
  const [newStatus, setNewStatus] = useState(""); // Initialize with an empty string
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (params) => {
    setLoading(true);
    try {
      const response = await apiGetOrderByAdmin({
        ...params,
        limit: process.env.REACT_APP_LIMIT,
      });
      if (response.success) {
        setCounts(response.counts);
        setOrders(response.orders);
      } else {
        console.error("Failed to fetch orders:", response);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pr = Object.fromEntries([...params]);
    fetchOrders(pr);
  }, [params]);

  const handleSearchStatus = ({ value }) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ status: value }).toString(),
    });
  };

  const handleUpdateStatus = async (oid) => {
    try {
      const response = await apiUpdateOrderStatus(oid, {
        status: newStatus.value,
      });

      if (response && response.success) {
        fetchOrders(params);
        setEditEl(null);
        setNewStatus("");
      } else {
        console.error(response ? response.response : "No response received.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="w-full p-4 my-4 relative">
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>Manage Order</h1>
      </div>
      <div className="flex justify-end items-center px-4 py-4">
        <form className="w-[45%] grid grid-cols-2 items-center gap-4">
          <div className="col-span-1">
            <InputForm
              register={register}
              errors={errors}
              id="q"
              fullWidth
              placeholder="Search"
              style="rounded-md"
            />
          </div>
          <div className="col-span-1 flex items-center">
            <CustomSelect
              options={statusOrder}
              value={status}
              onChange={handleSearchStatus}
              wrapClassname="w-full"
            />
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center">Loading orders...</div>
      ) : (
        <table className="table-auto w-full mb-6 text-left min-w-[1000px]">
          <thead className="font-bold bg-[#273526] text-white text-[13px]">
            <tr>
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">User</th>
              <th className="px-2 py-2">Product</th>
              <th className="px-2 py-2">Total</th>
              <th className="px-2 py-2">P.Method</th>
              <th className="px-2 py-2">P.Status</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Created At</th>
              <th className="px-2 py-2">Updated At</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((el, index) => (
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
                <td className="px-2 py-2">
                  <span className="flex flex-col">
                    <span>
                    {el.orderBy?.lastname || "N/A"}{" "}
                    {el.orderBy?.firstname || "N/A"}
                    </span>
                    
                    <span>{el.orderBy?.mobile}</span>
                  </span>
                </td>
                <td className="px-2 py-2">
                  <span className="flex flex-col">
                    {el.products?.map((item) => (
                      <span key={item._id} className="py-2 border-b">
                        <img
                          src={item.image}
                          alt="img"
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <span className="flex flex-col mt-2">
                          <span className="text-main text-sm font-semibold">
                            {item.title}
                          </span>
                          <span className="gap-2 font-light flex items-center">
                            <span>Quantity: </span>
                            <span>{item.quantity}</span>
                          </span>
                          <span className="gap-2 font-light flex items-center">
                                    <span>Color: </span>
                                    <span>{item.color}</span>
                                  </span>
                        </span>
                      </span>
                    ))}
                  </span>
                </td>
                <td className="px-2 py-2">{`${formatMoney(el.total)}`}</td>
                <td className="px-2 py-2">{el.paymentMethod}</td>
                <td className="px-2 py-2">{el.paymentStatus}</td>
                <td className="py-2 px-2">
                  {editEl?._id === el._id ? (
                    <CustomSelect
                      options={statusOrder}
                      value={newStatus}
                      onChange={(val) => setNewStatus(val)}
                      wrapClassname="w-32"
                    />
                  ) : (
                    <span>{el.status}</span>
                  )}
                </td>

                <td className="px-2 py-2">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>

                <td className="px-2 py-2">
                  {moment(el.updatedAt).format("DD/MM/YYYY")}
                </td>

                <td className="py-16 px-2 flex gap-2 ">
                  {editEl?._id === el._id ? (
                    <>
                      <span
                        onClick={() => handleUpdateStatus(el._id)}
                        className="px-3 py-2 text-white cursor-pointer bg-green-600 rounded-[5px] hover:bg-green-700 transition duration-150"
                      >
                        Save
                      </span>
                      <span
                        onClick={() => setEditEl(null)} // Set editEl to null to hide the edit state
                        className="px-3 py-2 text-white cursor-pointer bg-gray-600 rounded-[5px] hover:bg-gray-700 transition duration-150"
                      >
                        Back
                      </span>
                    </>
                  ) : (
                    <span
                      onClick={() => setEditEl(el)} // Set editEl to the current element to enter edit mode
                      className="px-3 py-2 text-white cursor-pointer bg-main rounded-[5px] hover:bg-[#79a076] transition duration-150"
                    >
                      Update
                    </span>
                  )}
                  <span className="px-3 py-2 text-white cursor-pointer bg-red-600 rounded-[5px] hover:bg-red-700 transition duration-150">
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex w-full px-4">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default ManageOrder;


