import React, { useState } from "react";
import { Button, Loading } from "../../components";
import {createSearchParams, useLocation, useNavigate, useParams} from "react-router-dom";
import { apiResetPassword } from "../../apis/user";
import { showModal } from "../../store/app/appSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import path from "../../ultils/path";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const {token} = useParams()
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleResetPassWord = async() => {
    dispatch(
      showModal({ isShowModal: true, modalChildren: <Loading /> })
    );
    const response = await apiResetPassword({password, token})
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    console.log(response)
    Swal.fire({
      title: "Congratulations!",
      text: response.mes || "Reset Your Password successful!",
      icon: "success",
      confirmButtonText: "OK",
      customClass: {
        title: "custom-title",
        text: "custom-text",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {navigate(
        `/${path.LOGIN}`)}
    })
  };

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 bg-white py-8 z-50 flex flex-col items-center">
      <div className="flex flex-col gap-4 w-full max-w-lg">
        <h3 className="art-word-shadow">Forgot</h3>
        <h3 className="gradient-text -mt-8">Password?</h3>
        <label htmlFor="password" className="text-lg font-semibold">
          Enter your new Password:
        </label>
        <input
          type="text"
          id="password"
          className="w-full pb-2 border-b-2 border-gray-300 outline-none placeholder:text-sm"
          placeholder="Type here"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-end w-full max-w-md mt-4 gap-2">
        <Button name="Submit" handleOnClick={handleResetPassWord} />
      </div>
    </div>
  );
};

export default ResetPassword;
