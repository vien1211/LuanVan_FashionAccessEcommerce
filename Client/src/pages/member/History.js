// import React, { useEffect, useState } from "react";
// import {
//   apiCancelOrder,
//   apiGetOrderByUser,
//   apiUpdateOrderStatus,
//   apiUpdatePaymentStatus,
// } from "../../apis";
// import { CustomSelect, InputForm, Pagination } from "../../components";
// import { useForm } from "react-hook-form";
// import {
//   createSearchParams,
//   useLocation,
//   useNavigate,
//   useSearchParams,
// } from "react-router-dom";
// import { statusOrder } from "../../ultils/contants";
// import moment from "moment";
// import { formatMoney } from "../../ultils/helper";
// import Swal from "sweetalert2";
// import { OrderDetail } from ".";

// const History = () => {
//   const {
//     register,
//     formState: { errors },
//     watch,
//   } = useForm();
//   const q = watch("q");
//   const status = watch("status");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [counts, setCounts] = useState(0);
//   const [orders, setOrders] = useState([]);
//   const [params] = useSearchParams();

//   const [orderDetail, setOrderDetail] = useState(null);
//   const fetchOrders = async (params) => {
//     const response = await apiGetOrderByUser({
//       ...params,
//       limit: process.env.REACT_APP_LIMIT || 10,
//       page: params.page || 1,
//     });
//     if (response.success) {
//       setCounts(response.counts);
//       setOrders(response.orders);
//     } else {
//       console.error("Error fetching orders:", response.message);
//     }
//   };

//   useEffect(() => {
//     const pr = Object.fromEntries([...params]);
//     console.log("Fetching orders with params:", pr);
//     fetchOrders(pr);
//   }, [params]);

//   const handleSearchStatus = ({ value }) => {
//     navigate({
//       pathname: location.pathname,
//       search: createSearchParams({ status: value }).toString(),
//     });
//   };

//   const handleCancelOrder = async (oid) => {
//     try {
//       const result = await Swal.fire({
//         title: "Are you sure?",
//         text: "Do you really want to cancel this order?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#d33",
//         cancelButtonColor: "#3085d6",
//         confirmButtonText: "Yes, cancel it!",
//         cancelButtonText: "No, keep it",
//         customClass: {
//           title: "custom-title",
//           text: "custom-text",
//           confirmButton: "custom-confirm-button",
//           cancelButton: "custom-cancel-button",
//         },
//       });

//       if (result.isConfirmed) {
//         const response = await apiCancelOrder(oid);

//         if (response.success) {
//           setOrders((prevOrders) =>
//             prevOrders.map((order) =>
//               order._id === oid ? { ...order, status: "Cancelled" } : order
//             )
//           );

//           Swal.fire({
//             icon: "success",
//             title: "Order Cancelled",
//             text: "Your order has been cancelled successfully!",
//             confirmButtonText: "OK",
//             customClass: {
//               title: "custom-title",
//               text: "custom-text",
//               confirmButton: "custom-confirm-button",
//               cancelButton: "custom-cancel-button",
//             },
//           });
//         } else {
//           Swal.fire({
//             icon: "error",
//             title: "Cancellation Failed",
//             text: response.message || "Something went wrong!",
//             confirmButtonText: "OK",
//           });
//         }
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: `Something went wrong: ${error.message}`,
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   const handleConfirmReceived = async (oid) => {
//     try {
//       const result = await Swal.fire({
//         title: "Confirm Receipt",
//         text: "Do you confirm that you have received this order?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, I received it!",
//         cancelButtonText: "No!",
//       });

//       if (result.isConfirmed) {
//         // Cập nhật paymentStatus thành "Paid"
//         const paymentResponse = await apiUpdatePaymentStatus(oid, {
//           paymentStatus: "Paid",
//         });

//         if (paymentResponse.success) {
//           // Cập nhật status thành "Success"
//           const statusResponse = await apiUpdateOrderStatus(oid, {
//             status: "Success",
//           });

//           if (statusResponse.success) {
//             setOrders((prevOrders) =>
//               prevOrders.map((order) =>
//                 order._id === oid
//                   ? { ...order, status: "Success", paymentStatus: "Paid" }
//                   : order
//               )
//             );

//             Swal.fire({
//               icon: "success",
//               title: "You have received the item!",
//               text: "Your order has been completed.",
//               confirmButtonText: "OK",
//               customClass: {
//                 title: "custom-title",
//                 text: "custom-text",
//                 confirmButton: "custom-confirm-button",
//                 cancelButton: "custom-cancel-button",
//               },
//             });
//           } else {
//             Swal.fire({
//               icon: "error",
//               title: "Failed to update order status",
//               text: statusResponse.message || "Something went wrong!",
//               confirmButtonText: "OK",
//               customClass: {
//                 title: "custom-title",
//                 text: "custom-text",
//                 confirmButton: "custom-confirm-button",
//                 cancelButton: "custom-cancel-button",
//               },
//             });
//           }
//         } else {
//           Swal.fire({
//             icon: "error",
//             title: "Failed to update payment status",
//             text: paymentResponse.message || "Something went wrong!",
//             confirmButtonText: "OK",
//             customClass: {
//               title: "custom-title",
//               text: "custom-text",
//               confirmButton: "custom-confirm-button",
//               cancelButton: "custom-cancel-button",
//             },
//           });
//         }
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: `Something went wrong: ${error.message}`,
//         confirmButtonText: "OK",
//         customClass: {
//           title: "custom-title",
//           text: "custom-text",
//           confirmButton: "custom-confirm-button",
//           cancelButton: "custom-cancel-button",
//         },
//       });
//     }
//   };

//   const handleReviewProduct = (order) => {
//     console.log(order);
//     const productId = order.product._id;
//     navigate(`/product/${productId}`);
//   };

//   return (
//     <div className="w-full p-4 my-4 relative">
//       <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
//         <h1>History Ordered</h1>
//       </div>
//       <div className="flex justify-end items-center px-4 py-4">
//         <form className="w-[45%] grid grid-cols-1 items-center gap-4">
          
//           <div className="col-span-1 flex items-center">
//             <CustomSelect
//               options={statusOrder}
//               value={status}
//               onChange={(val) => handleSearchStatus(val)}
//               wrapClassname="w-full"
//             />
//           </div>
//         </form>
//       </div>

//       <div className="grid grid-cols-1 gap-4">
//         {orders.length > 0 ? (
//           orders.map((el, index) => (
//             <div
//               key={el._id}
//               className={`border text-gray-600 rounded-lg p-4 shadow-md ${
//                 index % 2 === 0 ? "bg-white" : "bg-gray-200"
//               }`}
//             >
//               <div className="flex justify-between items-center">
//                 <h3 className="font-semibold text-lg">Order #{el._id}</h3>
//                 <span className="text-gray-600">
//                   {moment(el.createdAt).format("DD/MM/YYYY")}
//                 </span>
//               </div>
//               <div className="mt-2">
//                 <span className="font-semibold">Total: </span>
//                 <span>{`${formatMoney(el.total)}`}</span>
//               </div>
//               <div className="mt-2">
//                 <span className="font-semibold">Payment Method: </span>
//                 <span>{el.paymentMethod}</span>
//               </div>
//               <div className="mt-2">
//                 <span className="font-semibold">Payment Status: </span>
//                 <span>{el.paymentStatus}</span>
//               </div>
//               <div className="mt-2">
//                 <span className="font-semibold">Order Status: </span>
//                 <span>{el.status}</span>
//               </div>
//               <div className="mt-2">
           
//                 <h4 className="font-semibold py-2">Products:</h4>
//                 <div className="flex flex-col">
//                   {el.products?.map((item) => (
//                     <div key={item._id} className="flex items-center mr-4 mb-4">
//                       <img
//                         src={item.image}
//                         alt="img"
//                         className="w-[65px] h-[65px] rounded-md object-cover"
//                       />
//                       <div className="ml-2">
//                         <span className="text-main font-semibold text-md">
//                           {item.title}
//                         </span>
//                         <div className="gap-1 flex items-center">
//                           <span>Quantity:</span>
//                           <span>{item.quantity}</span>
//                         </div>
//                         <div className="gap-1 flex items-center">
//                           <span>Color:</span>
//                           <span>{item.color}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="mt-4 flex gap-2">
//                 {el.status === "Delivered" && (
//                   <span
//                     onClick={() => handleConfirmReceived(el._id)}
//                     className="px-3 py-2 text-white cursor-pointer bg-green-600 rounded-[5px] hover:bg-green-700 transition duration-150"
//                   >
//                     Đã nhận hàng
//                   </span>
//                 )}
//                 {el.status === "Success" && (
//                   <span
//                     onClick={() => handleReviewProduct(el._id)}
//                     className="px-3 py-2 text-white cursor-pointer bg-blue-600 rounded-[5px] hover:bg-blue-700 transition duration-150"
//                   >
//                     Đánh Giá Sản Phẩm
//                   </span>
//                 )}
//                 {el.status === "Processing" && (
//                   <span
//                     className="px-3 py-2 text-white cursor-pointer bg-red-600 rounded-[5px] hover:bg-red-700 transition duration-150"
//                     onClick={() => handleCancelOrder(el._id)}
//                   >
//                     Hủy đơn hàng
//                   </span>
//                 )}
//                 <span
//                     onClick={() => setOrderDetail(el)}
//                     className="px-3 py-2 text-white cursor-pointer bg-main rounded-[5px] hover:bg-[#79a076] transition duration-150"
//                   >
//                     View Order Detail
//                   </span>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-gray-600">No orders found.</div>
//         )}
//       </div>

//       {orderDetail && (
//       <div className="absolute inset-0 z-50 min-h-screen bg-[#F5F5FA] ">
//         <OrderDetail oid={orderDetail} setOrderDetail={setOrderDetail} />
//       </div>
//     )}

//       <div className="flex w-full px-4 mt-6">
//         <Pagination totalCount={counts} />
//       </div>
//     </div>
//   );
// };

// export default History;


import React, { useEffect, useState } from "react";
import {
  apiCancelOrder,
  apiGetOrderByUser,
  apiUpdateOrderStatus,
  apiUpdatePaymentStatus,
} from "../../apis";
import { InputForm, Pagination } from "../../components";
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
import Swal from "sweetalert2";
import { OrderDetail } from ".";


  const statusStyles = {
    Confirmed: "bg-yellow-300 text-yellow-800",
    "Awaiting Confirmation": "bg-gray-200 text-gray-800",
    "Shipped Out": "bg-blue-300 text-blue-800",
    "On Delivery": "bg-pink-300 text-pink-800",
    Delivered: "bg-green-300 text-green-800",
    Cancelled: "bg-red-800 text-red-200",
    Success: "bg-green-600 text-green-50",
  };


const History = () => {
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
  const [activeStatus, setActiveStatus] = useState("All");

  const [orderDetail, setOrderDetail] = useState(null);
  const fetchOrders = async (params) => {
    const response = await apiGetOrderByUser({
      ...params,
      limit: process.env.REACT_APP_LIMIT || 10,
      page: params.page || 1,
    });
    if (response.success) {
      setCounts(response.counts);
      setOrders(response.orders);
    } else {
      console.error("Error fetching orders:", response.message);
    }
  };

  useEffect(() => {
    const pr = Object.fromEntries([...params]);
    console.log("Fetching orders with params:", pr);
    fetchOrders(pr);
    
  }, [params]);

  const handleSearchStatus = (status) => {
    const query = status === "All" ? {} : { status };
    navigate({
      pathname: location.pathname,
      search: createSearchParams(query).toString(),
    });
    
    setActiveStatus(status);
  };
  
    const handleCancelOrder = async (oid) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to cancel this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, cancel it!",
        cancelButtonText: "No, keep it",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      });

      if (result.isConfirmed) {
        const response = await apiCancelOrder(oid);

        if (response.success) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === oid ? { ...order, status: "Cancelled" } : order
            )
          );

          Swal.fire({
            icon: "success",
            title: "Order Cancelled",
            text: "Your order has been cancelled successfully!",
            confirmButtonText: "OK",
            customClass: {
              title: "custom-title",
              text: "custom-text",
              confirmButton: "custom-confirm-button",
              cancelButton: "custom-cancel-button",
            },
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Cancellation Failed",
            text: response.message || "Something went wrong!",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Something went wrong: ${error.message}`,
        confirmButtonText: "OK",
      });
    }
  };


    const handleConfirmReceived = async (oid) => {
          try {
            const result = await Swal.fire({
              title: "Confirm Receipt",
              text: "Do you confirm that you have received this order?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, I received it!",
              cancelButtonText: "No!",
            });
      
            if (result.isConfirmed) {
              // Cập nhật paymentStatus thành "Paid"
              const paymentResponse = await apiUpdatePaymentStatus(oid, {
                paymentStatus: "Paid",
              });
      
              if (paymentResponse.success) {
                // Cập nhật status thành "Success"
                const statusResponse = await apiUpdateOrderStatus(oid, {
                  status: "Success",
                });
      
                if (statusResponse.success) {
                  setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                      order._id === oid
                        ? { ...order, status: "Success", paymentStatus: "Paid" }
                        : order
                    )
                  );
      
                  Swal.fire({
                    icon: "success",
                    title: "You have received the item!",
                    text: "Your order has been completed.",
                    confirmButtonText: "OK",
                    customClass: {
                      title: "custom-title",
                      text: "custom-text",
                      confirmButton: "custom-confirm-button",
                      cancelButton: "custom-cancel-button",
                    },
                  });
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Failed to update order status",
                    text: statusResponse.message || "Something went wrong!",
                    confirmButtonText: "OK",
                    customClass: {
                      title: "custom-title",
                      text: "custom-text",
                      confirmButton: "custom-confirm-button",
                      cancelButton: "custom-cancel-button",
                    },
                  });
                }
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Failed to update payment status",
                  text: paymentResponse.message || "Something went wrong!",
                  confirmButtonText: "OK",
                  customClass: {
                    title: "custom-title",
                    text: "custom-text",
                    confirmButton: "custom-confirm-button",
                    cancelButton: "custom-cancel-button",
                  },
                });
              }
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Something went wrong: ${error.message}`,
              confirmButtonText: "OK",
              customClass: {
                title: "custom-title",
                text: "custom-text",
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
              },
            });
          }
        };
        
        
  return (
    <div className="w-full p-4 my-4 relative">
      <div className="flex px-6 bg-[#F5F5FA] justify-between items-center text-3xl font-bold">
        <h1>History Ordered</h1>
      </div>
      
      {/* Buttons for selecting order status */}
      <div className="flex justify-end items-center px-2 py-4">
        <div className="flex space-x-4">
          <button
            onClick={() => handleSearchStatus("All")}
            className={`px-4 py-2 rounded hover:bg-main hover:text-white transition duration-150 ${activeStatus === "All" ? "bg-main text-white" : "bg-gray-300 text-gray-800"}`}
          >
            Tất cả
          </button>
          {statusOrder.map((status) => (
            <button
              key={status.value}
              onClick={() => handleSearchStatus(status.value)}
              className={`px-2 rounded hover:bg-main  hover:text-white transition duration-150 ${activeStatus === status.value ? "bg-main text-white" : "bg-gray-300 text-gray-800"}`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.length > 0 ? (
          orders.map((el, index) => (
            <div
              key={el._id}
              className={`border text-gray-600 rounded-lg p-4 shadow-md ${
                index % 2 === 0 ? "bg-white" : "bg-gray-200"
              }`}
            >
              {/* Order details */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Order #{el._id}</h3>
                <span className="text-gray-600">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </span>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Total: </span>
                <span>{`${formatMoney(el.total)} VNĐ`}</span>
              </div>
              {/* <div className="mt-2">
                <span className="font-semibold">Payment Method: </span>
                <span>{el.paymentMethod}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Payment Status: </span>
                <span>{el.paymentStatus}</span>
              </div> */}
              <div className="mt-2">
                <span className="font-semibold">Order Status: </span>
                <span className={`px-2 py-1 rounded-full ${statusStyles[el.status] || 'bg-gray-300 text-gray-800'}`}>
                  {el.status}
                </span>
              </div>
              
              <div className="">
                <h4 className="font-semibold py-2">Products:</h4>
                <div className="flex flex-col">
                  {el.products?.map((item) => (
                    <div key={item._id} className="flex items-center mr-4 mb-4">
                      <img
                        src={item.image}
                        alt="img"
                        className="w-[65px] h-[65px] rounded-md object-cover"
                      />
                      <div className="ml-2">
                        <span className="text-main font-semibold text-md">
                          {item.title}
                        </span>
                        <div className="gap-1 flex items-center">
                          <span>Quantity:</span>
                          <span>{item.quantity}</span>
                        </div>
                        <div className="gap-1 flex items-center">
                          <span>Color:</span>
                          <span>{item.color}</span>
                        </div>
                      </div>
                    </div>
                    
                  ))}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {/* Action buttons for order status */}
                {el.status === "Delivered" && (
                  <span
                    onClick={() => handleConfirmReceived(el._id)}
                    className="px-3 py-2 text-white cursor-pointer bg-green-600 rounded-[5px] hover:bg-green-700 transition duration-150"
                  >
                    Đã nhận hàng
                  </span>
                )}
                {/* {el.status === "Success" && (
                  <span
                    className="px-3 py-2 text-main border border-main rounded-[5px]"
                  >
                    Your Order Has Completed
                  </span>
                )} */}

                

                {el.status === "Awaiting Confirmation" && (
                  <span
                    className="px-3 py-2 text-white cursor-pointer bg-red-600 rounded-[5px] hover:bg-red-700 transition duration-150"
                    onClick={() => handleCancelOrder(el._id)}
                  >
                    Hủy đơn hàng
                  </span>
                )}
                <span
                  onClick={() => setOrderDetail(el)}
                  className="px-3 py-2 text-white cursor-pointer bg-main rounded-[5px] hover:bg-[#79a076] transition duration-150"
                >
                  View Order Detail
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">No orders found.</div>
        )}
      </div>

      {orderDetail && (
        <div className="absolute inset-0 z-50 min-h-screen bg-[#F5F5FA] ">
          <OrderDetail oid={orderDetail} setOrderDetail={setOrderDetail} />
        </div>
      )}

      <div className="flex w-full px-4 mt-6">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );

};

export default History;
