import React from "react";
import { formatMoney } from "../../ultils/helper";
import moment from "moment";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import * as XLSX from "xlsx";

import { Step } from "../../components";

const OrderDetail = ({ oid, setOrderDetail }) => {
    
  // Function to close the detail view
  //   const handleClose = () => {
  //     setOrderDetail(null);
  //   };

  window.scrollTo(0,0)

  const exportToExcel = () => {
    const orderData = [
      {
        "Order ID": oid._id,
        "Order Date": moment(oid.createdAt).format("DD/MM/YYYY"),
        "Order Status": oid.status,
        "Customer Name": `${oid.orderBy?.lastname} ${oid.orderBy?.firstname}`,
        "Contact Phone": oid.orderBy?.mobile,
        "Shipping Address": oid.orderBy?.address,
        "Payment Method": oid.paymentMethod,
        "Payment Status": oid.paymentStatus,
        "Total": `${formatMoney(oid.total)} VNĐ`,
      },
    ];
    const productData = oid.products.map((item) => ({
      "Product Title": item.title,
      "Quantity": item.quantity,
      "Color": item.color,
      "Price": `${formatMoney(item.price)} VNĐ`,
    }));

    const workbook = XLSX.utils.book_new();
    const orderSheet = XLSX.utils.json_to_sheet(orderData);
    const productSheet = XLSX.utils.json_to_sheet(productData);

    XLSX.utils.book_append_sheet(workbook, orderSheet, "Order Info");
    XLSX.utils.book_append_sheet(workbook, productSheet, "Products");

    XLSX.writeFile(workbook, `Order_${oid._id}.xlsx`);
  };

  return (
    <div className="w-full p-4 relative">
      <div className="flex px-6 bg-[#F5F5FA] gap-2 items-center text-3xl font-bold">
        <IoReturnDownBackOutline
          className="cursor-pointer hover:text-[#273526]"
          onClick={() => setOrderDetail(null)}
        />
        <h1>Order Detail</h1>
        <button
          onClick={exportToExcel}
          className="flex ml-auto gap-2 bg-[#6D8777] text-white text-sm font-light px-4 py-2 rounded-full shadow-md hover:bg-[#405c3e]"
        >
          <HiOutlineArrowDownTray size={20} className=""/>
          Export Excel
        </button>
      </div>

      <div className="p-4">
        <div className="border-b border-t border-b-[#90ce90] py-4 text-[18px]">
          <div className="mb-4 ">
            <span className="font-semibold">Order ID: </span>
            <span>{oid._id}</span>
          </div>
          <div className="mb-4 mt-2">
            <span className="font-semibold">Order Date: </span>
            <span>{moment(oid.createdAt).format("DD/MM/YYYY")}</span>
          </div>

          {(oid.status === "Delivered" || oid.status === "Success") && (
            <div className="mb-4">
              <span className="font-semibold">Delivery Date: </span>
              <span>{moment(oid.deliveryDate).format("DD/MM/YYYY")}</span>
            </div>
          )}
        </div>

        <div className=" border-b py-4 border-[#90ce90] text-[18px]">
          <span className="font-semibold">Order Status: </span>
          <Step currentStatus={oid.status} />
        </div>

        <div className="flex w-full mb-4 justify-between">
          {/* First Column */}
          <div className="w-[40%] mt-4 rounded-lg bg-main text-white ml-6">
            <div className="bg-gray-700 rounded-t-lg">
              <h2 className="font-bold uppercase text-white text-[18px] py-2 px-3">
                Shipping Info
              </h2>
            </div>

            <div className="px-3 font-light">
              <div className="mb-4 mt-2">
                <span className="font-semibold">Order Date: </span>
                <span>{moment(oid.createdAt).format("DD/MM/YYYY")}</span>
              </div>

              <div className="mb-4">
                <span className="font-semibold">Customer Name: </span>
                <span>
                  {oid.orderBy?.lastname} {oid.orderBy?.firstname}
                </span>
              </div>

              <div className="mb-4">
                <span className="font-semibold">Contact Phone: </span>
                <span>{oid.orderBy?.mobile}</span>
              </div>

              <div className="mb-4">
                <span className="font-semibold">Shipping Address: </span>
                <span>{oid.orderBy?.address}</span>
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div className="w-[40%] mt-4 rounded-lg bg-main text-white mr-6">
          <div className="bg-gray-700 rounded-t-lg">
              <h2 className="font-bold uppercase text-white text-[18px] py-2 px-3">
                Payment Info
              </h2>
            </div>

            <div className="px-3 font-light">
            <div className="mb-4 mt-2">
              <span className="font-semibold">Payment Method: </span>
              <span>{oid.paymentMethod}</span>
            </div>

            <div className="mb-4">
              <span className="font-semibold">Payment Status: </span>
              <span>{oid.paymentStatus}</span>
            </div>

            <div className="mb-4">
              <span className="font-semibold">Total: </span>
              <span>{`${formatMoney(oid.total)} VNĐ`}</span>
            </div>

            <div className="mb-4">
              <span className="font-semibold">Order Status: </span>
              <span>{oid.status}</span>
            </div>
          </div>
          </div>
        </div>

        <h4 className="font-semibold border-t border-t-[#90ce90] py-2 text-[18px]">Order Item:</h4>
        <div className="flex flex-col">
          {oid.products?.map((item) => (
            <div key={item._id} className="flex items-center mb-4 bg-white shadow-md p-4 rounded-lg">
              <img
                src={item.image}
                alt={item.title}
                className="w-[120px] h-[120px] border rounded-md shadow-sm object-contain"
              />
              <div className="ml-4">
                <span className="text-main font-semibold">{item.title}</span>
                <div className="items-center">
                  <span>Quantity: </span>
                  <span> {item.quantity}</span>
                </div>
                <div className="items-center">
                  <span>Color: </span>
                  <span>{item.color}</span>
                </div>
                <div className="items-center">
                  <span>Price: </span>
                  <span>{`${formatMoney(item.price)} VNĐ`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
