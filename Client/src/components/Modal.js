import React from "react";
import { useDispatch } from "react-redux";
import { showModal } from "../store/app/appSlice";

const Modal = ({ children }) => {
  const dispatch = useDispatch();
  return (
    <div
      onClick={() =>
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
      }
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        zIndex: "9999",
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Adjust the opacity value (0.0 - 1.0)
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default Modal;
