import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { apiCreateOrder } from "../apis";
import Swal from "sweetalert2";
import { showModal } from "../store/app/appSlice";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

// This value is from the props in the UI
const style = { layout: "vertical" };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({
  currency,
  showSpinner,
  amount,
  payload,
  setIsSuccess,
}) => {
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner]);

  const handleSaveOrder = async () => {
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiCreateOrder({
      ...payload,
      status: "Awaiting Confirmation",
      paymentStatus: "Paid",
      paymentMethod: "paypal",
    });
    dispatch(showModal({ isShowModal: false, modalChildren: null }));

    if (response.success) {
      setIsSuccess(true);
      setTimeout(() => {
        // Swal.fire("Congratulation!", "Order Successfully!", "success").then(
        //   () => {
        //     navigate("/");
        //   }
        // );
        Swal.fire({
          title: "<h3 style='color: #4CAF50;'>Congratulation!</h3>",
          text: "Order Successfully!",
          icon: "success",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        }).then(() => {
          navigate("/member/order-history");
        });
      }, 500);
    }
  };
  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style, currency, amount]}
        fundingSource={undefined}
        createOrder={(data, actions) =>
          actions.order
            .create({
              purchase_units: [
                { amount: { currency_code: currency, value: amount } },
                
              ],
              
            })
            .then((orderId) => orderId)
        }
        onApprove={(data, actions) =>
          actions.order.capture().then(async (response) => {
            if (response.status === "COMPLETED") {
              handleSaveOrder();
            }
            console.log(response);
            console.log(payload);
          })
        }
      />
    </>
  );
};

export default function Paypal({ amount, payload, setIsSuccess }) {
  return (
    <div style={{ maxWidth: "750px" }}>
      <PayPalScriptProvider
        options={{ clientId: "test", components: "buttons", currency: "USD" }}
      >
        <ButtonWrapper
          payload={payload}
          currency={"USD"}
          amount={amount}
          showSpinner={false}
          setIsSuccess={setIsSuccess}
        />
      </PayPalScriptProvider>
    </div>
  );
}
