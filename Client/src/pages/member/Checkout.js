// // import React, { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { formatMoney } from "../../ultils/helper";
// // import { ConfettiNoti, InputForm, Paypal } from "../../components";
// // import { useForm } from "react-hook-form";
// // import { getCurrentUser } from "../../store/user/asyncActions";
// // import { useNavigate } from "react-router-dom";

// // const Checkout = () => {
// //   const {
// //     register,
// //     formState: { errors },
// //     watch,
// //     setValue,
// //   } = useForm();
// //   const { currentCart, current } = useSelector((state) => state.user);
// //   const [isSuccess, setIsSuccess] = useState(false);
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const address = watch("address");

// //   useEffect(() => {
// //     setValue('address', current?.address);
// //   }, [current.address, setValue]);

// //   useEffect(() => {
// //     if (isSuccess) dispatch(getCurrentUser());
    
// //   }, [isSuccess]);
// //   return (
// //     <div className="w-main grid grid-cols-10 mx-auto py-8 gap-8">
// //       {isSuccess && <ConfettiNoti />}
// //       <div className="col-span-7">
// //         <h2 className="text-3xl py-4 font-semibold">Checkout Your Order</h2>
// //         <table className="table-auto w-full">
// //           <thead>
// //             <tr className="border bg-gray-200">
// //               <th className="p-2 text-left">Products</th>
// //               <th className="p-2 text-center">Quantity</th>
// //               <th className="p-2 text-right">Price</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {currentCart?.map((el) => (
// //               <tr className="border" key={el._id}>
// //                 <td className="text-left">{el.title}</td>
// //                 <td className="text-center">{el.quantity}</td>
// //                 <td className="text-right">{formatMoney(el.price) + " VNĐ"}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       <div className="col-span-3 p-4">
// //         <div className="flex items-center justify-between gap-8">
// //           <span>Your Address</span>
// //           <span>{current?.address}</span>
// //           {/* <InputForm
// //             label="Your Address"
// //             register={register}
// //             errors={errors}
// //             id="address"
// //             validate={{
// //               required: "Require",
// //             }}
// //             fullWidth={true}
// //             placeholder="Type your address first"
// //             style="rounded-md text-[15px]"
// //           /> */}
// //         </div>
// //         <div className="flex justify-between mb-4">
// //           <span>Subtotal</span>
// //           <span className="text-[#DA7474]">{`${formatMoney(
// //             currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0)
// //           )} VNĐ`}</span>
// //         </div>
// //         {address && address?.length > 10 && (
// //           <div>
// //             <Paypal
// //               payload={{
// //                 products: currentCart,
// //                 total: Math.round(
// //                   +currentCart?.reduce(
// //                     (sum, el) => +el?.price * el.quantity + sum,
// //                     0
// //                   ) / 24880
// //                 ),
// //                 address,
// //               }}
// //               setIsSuccess={setIsSuccess}
// //               amount={Math.round(
// //                 +currentCart?.reduce(
// //                   (sum, el) => +el?.price * el.quantity + sum,
// //                   0
// //                 ) / 24880
// //               )}
// //             />
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Checkout;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { formatMoney } from "../../ultils/helper";
// import { ConfettiNoti, Paypal, ShippingFee } from "../../components";
// import { useForm } from "react-hook-form";
// import { getCurrentUser } from "../../store/user/asyncActions";
// import { useNavigate } from "react-router-dom";

// const Checkout = () => {
//   const {
//     register,
//     formState: { errors },
//     watch,
//     setValue,
//   } = useForm();
//   const { currentCart, current } = useSelector((state) => state.user);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const address = watch("address");

//   useEffect(() => {
//     setValue("address", current?.address);
//   }, [current.address, setValue]);

//   useEffect(() => {
//     if (isSuccess) dispatch(getCurrentUser());
//   }, [isSuccess]);

//   // Calculate the subtotal
//   const subtotal = currentCart?.reduce(
//     (sum, el) => +el?.price * el.quantity + sum,
//     0
//   );
//   const calculateShippingFee = (subtotal) => {
//     if (subtotal < 5000000) return 50000; // Orders under 5 million
//     if (subtotal >= 5000000 && subtotal <= 50000000) return 25000; // Orders between 5 million and 50 million
//     return 0; // Free shipping for orders over 50 million
//   };


//   return (
//     <div className="w-main grid grid-cols-10 mx-auto py-8 gap-8">
//       {isSuccess && <ConfettiNoti />}
//       <div className="col-span-7">
//         <h2 className="text-3xl py-4 font-semibold">Checkout Your Order</h2>
//         <table className="table-auto w-full">
//           <thead>
//             <tr className="border bg-gray-200">
//               <th className="p-2 text-left">Products</th>
//               <th className="p-2 text-center">Quantity</th>
//               <th className="p-2 text-right">Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentCart?.map((el) => (
//               <tr className="border" key={el._id}>
//                 <td className="text-left">{el.title}</td>
//                 <td className="text-center">{el.quantity}</td>
//                 <td className="text-right">
//                   {formatMoney(el.price) + " VNĐ"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="col-span-3 p-4">
//         <div className="flex items-center justify-between gap-8 mb-4">
//           <span>Address</span>
//           <span>{current?.address}</span>
//         </div>
//         <div className="flex justify-between mb-4">
//           <span>Subtotal</span>
//           <span className="text-[#DA7474]">{`${formatMoney(
//             subtotal
//           )} VNĐ`}</span>
//         </div>
//         <ShippingFee subtotal={subtotal} shippingFee={calculateShippingFee(subtotal)} />
        
//         {address && address?.length > 10 && (
//           <div>
//             <Paypal
//               payload={{
//                 products: currentCart,
//                 total: Math.round((subtotal + calculateShippingFee(subtotal)) / 24880),
//                 address,
//               }}
//               setIsSuccess={setIsSuccess}
//               amount={Math.round((subtotal + calculateShippingFee(subtotal)) / 24880)}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatMoney } from "../../ultils/helper";
import { ConfettiNoti, Paypal, ShippingFee, CashOnDelivery } from "../../components";
import { useForm } from "react-hook-form";
import { getCurrentUser } from "../../store/user/asyncActions";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Checkout = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const { currentCart, current } = useSelector((state) => state.user);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const address = watch("address");

  useEffect(() => {
    setValue("address", current?.address);
  }, [current?.address, setValue]);

  useEffect(() => {
    if (isSuccess) dispatch(getCurrentUser());
  }, [isSuccess, dispatch]);

  const subtotal = currentCart?.reduce(
    (sum, el) => +el?.price * el.quantity + sum,
    0
  );

  const calculateShippingFee = (subtotal) => {
    if (subtotal < 5000000) return 50000;
    if (subtotal >= 5000000 && subtotal <= 50000000) return 25000;
    return 0;
  };

  const total = subtotal + calculateShippingFee(subtotal);

  const handleOrder = async () => {
    try {
      // Gửi thông tin đơn hàng đến server
      await axios.post('/api/orders', {
        products: currentCart.map(item => ({ 
          _id: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price
        })),
        address,
        total,
        paymentMethod,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const exchangeRate = 24880;

  return (
    <div className="w-main grid grid-cols-10 mx-auto py-8 px-8 gap-8 shadow-md rounded-2xl shadow-[#6D8777] border mt-8">
      {isSuccess && <ConfettiNoti />}
      
      <div className="col-span-7">
        <h2 className="text-3xl py-4 font-bold text-main">CHECK OUT YOUR ORDER</h2>
        <table className="table-auto w-full">
          <thead>
            <tr className="border bg-gray-200">
              <th className="p-2 text-left">Products</th>
              <th className="p-2 text-center">Quantity</th>
              <th className="p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {currentCart?.map((el) => (
              <tr className="border" key={el._id}>
                <td className="text-left p-2 text-main">{el.title}</td>
                <td className="text-center">{el.quantity}</td>
                <td className="text-right">
                  {formatMoney(el.price) + " VNĐ"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 bg-slate-100 rounded-[10px] p-4">
          <h3 className="text-md font-semibold mb-2">Payment Methods</h3>
          <div className="bg-slate-50 rounded-[10px] border border-main border-opacity-50 shadow-sm p-4 flex flex-col">
            <label>
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="mr-2"
              />
              PayPal
            </label>
            <label className="mt-2">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="mr-2"
              />
              Cash on Delivery
            </label>
          </div>
        </div>

        
      </div>
      
      <div className="col-span-3 p-5 shadow-md border rounded-[15px]">
        <div className="flex items-center justify-between gap-8 mb-3">
          <span>Address</span>
          <span>{current?.address}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Subtotal</span>
          <span className="text-[#DA7474]">{`${formatMoney(
            subtotal
          )} VNĐ`}</span>
        </div>
        <ShippingFee
          subtotal={subtotal}
          shippingFee={calculateShippingFee(subtotal)}
        />

        {address && address?.length > 10 && (
          <div className="flex flex-col gap-4">
            {paymentMethod === "paypal" && (
              <Paypal
                payload={{
                  products: currentCart,
                  total: total,
                  address,
                }}
                setIsSuccess={setIsSuccess}
                amount={Math.round(total / exchangeRate)}
              />
            )}

            {paymentMethod === "cod" && (
              <CashOnDelivery
                payload={{
                  products: currentCart,
                  total,
                  address,
                }}
                setIsSuccess={setIsSuccess}
                amount={total}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;




