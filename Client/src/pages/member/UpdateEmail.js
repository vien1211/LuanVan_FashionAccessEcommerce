

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, InputForm, Loading } from "../../components";
import { apiSendVerificationCode } from "../../apis";
import Swal from "sweetalert2";
import EnterVerificationCode from "./EnterVerificationCode";
import { showModal } from "../../store/app/appSlice";
import { useDispatch } from "react-redux";
import { IoReturnDownBackOutline } from "react-icons/io5";
import path from "../../ultils/path";
import { useNavigate } from "react-router-dom";

const UpdateEmail = ({ setEdit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); // Countdown timer state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendCode = async (data) => {
    try {
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiSendVerificationCode({ email: data.email });
      dispatch(showModal({ isShowModal: false, modalChildren: null }));

      if (response) {
        setIsCodeSent(true);
        setNewEmail(data.email);
        setTimeLeft(600);
        Swal.fire({
          title: "Success",
          text: "Verification code sent to your new email.",
          icon: "success",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      } else {
        Swal.fire({
          title: "Oops! Something went wrong",
          text: "New email is the same as current or This Email already exists",
          icon: "warning",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.message,
        icon: "error",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
    }
  };


  
  
  const handleBackEdit = () => {
    if (isCodeSent) {
      setIsCodeSent(false);
    } else {
      navigate(`/${path.MEMBER}/${path.PERSONAL}`);
    }
  };

  return (
    <div className="flex flex-col p-4">
      {isCodeSent && (
        <div className="flex text-3xl font-bold px-6">
          <IoReturnDownBackOutline
            className="cursor-pointer hover:text-[#273526]"
            onClick={handleBackEdit}
          />
        </div>
      )}
      <div className="flex flex-col items-center">
        <h3 className="art-word-shadow">Update</h3>
        <h3 className="gradient-text -mt-8">New Email</h3>
      </div>
      {isCodeSent ? (
        <EnterVerificationCode email={newEmail} timeLeft={timeLeft} />
      ) : (
        
        <form
          onSubmit={handleSubmit(handleSendCode)}
          className="flex flex-col w-full max-w-md mb-4 mx-auto"
        >
          <InputForm
            label="New Email"
            register={register}
            errors={errors}
            id="email"
            validate={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            fullWidth
            style="rounded-md mb-2"
          />
          <div className="flex gap-2 justify-end">
            <Button type="submit" name="Send Verification Code" />
            <Button
              onClick={handleBackEdit}
              type="submit"
              name="Cancel"
              style="px-4 py-2 bg-black rounded-md text-white items-center justify-center my-2"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateEmail;
