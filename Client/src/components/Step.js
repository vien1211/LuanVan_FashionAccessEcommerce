// import React from "react";
// import { statusOrder } from "../ultils/contants";

// import { FcProcess, FcShipped, FcCancel } from "react-icons/fc";
// import { FaShippingFast } from "react-icons/fa";
// import { BsBagCheckFill, BsPatchCheckFill, BsBoxSeamFill } from "react-icons/bs";
// import { RxStopwatch } from "react-icons/rx";

// const statusIcons = {
//   Cancelled: <FcCancel size={24} className="text-red-500" />,
//   "Awaiting Confirmation": <RxStopwatch size={24} className="text-gray-800"/>,
//   Confirmed: <FcProcess size={24} />,
//   "Shipped Out": <FcShipped size={24} />,
//   "On Delivery": <FaShippingFast size={24} className="text-[#aa842b]" />,
//   Delivered: <BsBagCheckFill size={24} className="text-green-800" />,
//   Success: <BsPatchCheckFill size={24} className="text-[#57a00a]" />,
// };

// const Steps = ({ currentStatus }) => {
//   const getStatusIndex = (status) => {
//     return statusOrder.findIndex((s) => s.value === status);
//   };

//   return (
//     <div className="flex items-center justify-center overflow-hidden">
//       {statusOrder.map((step, index) => {
//         const shouldDisplayStep = step.value === "Cancelled" ? currentStatus === "Cancelled" : true;

//         return (
//           shouldDisplayStep && (
//             <div key={step.value} className="flex flex-col py-4">
//               {/* Icon */}
//               <div className="flex items-center">
//                 <div
//                   className={`flex items-center justify-center w-16 h-16 rounded-full ${
//                     getStatusIndex(currentStatus) >= index ? "border border-green-500" : "bg-gray-200 opacity-30"
//                   }`}
//                 >
//                   {statusIcons[step.value]}

//                 </div>

//                 {/* Progress bar between icons */}
//                 {index < statusOrder.length - 1 && (
//                   <div
//                     className={`rounded-full h-1 w-[60px] mx-1 ${
//                       getStatusIndex(currentStatus) >= index ? "bg-green-500" : "bg-gray-200"
//                     }`}
//                   />
//                 )}

//               </div>

//               {/* Status label below the icon */}
//               <div
//                 className={`text-[16px] mt-3 ${
//                   getStatusIndex(currentStatus) >= index ? "  text-[#57a00a]" : "text-gray-500"
//                 }`}
//               >
//                 {step.label}
//               </div>

//             </div>
//           )
//         );
//       })}
//     </div>
//   );
// };

// export default Steps;

import React from "react";
import { statusOrder } from "../ultils/contants";

import { FcProcess, FcShipped, FcCancel } from "react-icons/fc";
import { FaShippingFast } from "react-icons/fa";
import {
  BsBagCheckFill,
  BsPatchCheckFill,
  BsBoxSeamFill,
} from "react-icons/bs";
import { RxStopwatch } from "react-icons/rx";
import moment from "moment"; // Thêm thư viện để xử lý ngày giờ

const statusIcons = {
  Cancelled: <FcCancel size={24} className="text-red-500" />,
  "Awaiting Confirmation": <RxStopwatch size={24} className="text-gray-800" />,
  Confirmed: <FcProcess size={24} />,
  "Shipped Out": <FcShipped size={24} />,
  "On Delivery": <FaShippingFast size={24} className="text-[#aa842b]" />,
  Delivered: <BsBagCheckFill size={24} className="text-green-800" />,
  Success: <BsPatchCheckFill size={24} className="text-[#57a00a]" />,
};

const Steps = ({ currentStatus, statusHistory, orderPlaced }) => {
  const getStatusIndex = (status) => {
    return statusOrder.findIndex((s) => s.value === status);
  };

  return (
    <div className="flex items-center justify-center overflow-hidden">
      {statusOrder.map((step, index) => {
        const shouldDisplayStep =
          step.value === "Cancelled" ? currentStatus === "Cancelled" : true;

        return (
          shouldDisplayStep && (
            <div key={step.value} className="flex flex-col py-4">
              {/* Icon */}
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full ${
                    getStatusIndex(currentStatus) >= index
                      ? "border border-green-500"
                      : "bg-gray-200 opacity-30"
                  }`}
                >
                  {statusIcons[step.value]}
                </div>

                {/* Progress bar between icons */}
                {index < statusOrder.length - 1 && (
                  <div
                    className={`rounded-full h-1 w-[70px] mx-1 ${
                      getStatusIndex(currentStatus) >= index
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* Status label below the icon */}
              <div
                className={`text-[16px] mt-3 ${
                  getStatusIndex(currentStatus) >= index
                    ? "text-[#57a00a]"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </div>

              {/* {step.value === "Awaiting Confirmation" ? (
                <div className="text-xs text-gray-500 mt-1">
                  {orderPlaced ? moment(orderPlaced).format("DD/MM/YYYY HH:mm A") : "N/A"}
                </div>
              ) : (
                statusHistory &&
                statusHistory.map((history, historyIndex) =>
                  history.status === step.value ? (
                    <div key={historyIndex} className="text-xs text-gray-500 mt-1">
                      <span>{moment(history.updatedAt).format("DD/MM/YYYY HH:mm A")}</span>
                    </div>
                  ) : null
                )
              )} */}
              {step.value === "Awaiting Confirmation" ? (
                <div className="text-xs text-gray-500 mt-1">
                  {orderPlaced
                    ? moment(orderPlaced).format("DD/MM/YYYY HH:mm A")
                    : "N/A"}
                </div>
              ) : step.value === "Cancelled" &&
                currentStatus === "Cancelled" ? (
                statusHistory &&
                statusHistory
                  .filter((history) => history.status === "Cancelled")
                  .map((history, historyIndex) => (
                    <div
                      key={historyIndex}
                      className="text-xs text-red-500 mt-1"
                    >
                      <span>
                        {moment(history.updatedAt).format("DD/MM/YYYY HH:mm A")}
                      </span>
                    </div>
                  ))
              ) : (
                statusHistory &&
                statusHistory.map((history, historyIndex) =>
                  history.status === step.value ? (
                    <div
                      key={historyIndex}
                      className="text-xs text-gray-500 mt-1"
                    >
                      <span>
                        {moment(history.updatedAt).format("DD/MM/YYYY HH:mm A")}
                      </span>
                    </div>
                  ) : null
                )
              )}
            </div>
          )
        );
      })}
    </div>
  );
};

export default Steps;
