import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { apiSendOtp, apiVerifyOtp } from "../../apis";
import { Button, InputForm, Loading } from "../../components";
import { useForm } from "react-hook-form";
import path from "../../ultils/path";
import { useNavigate } from "react-router-dom";
import { showModal } from "../../store/app/appSlice";
import { useDispatch } from "react-redux";
import { IoReturnDownBackOutline } from "react-icons/io5";

const UpdatePhoneNumber = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));;
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm; // Mẫu regex cho số điện thoại 10 chữ số
    return phoneRegex.test(number);
  };

  const handleSendOtp = async (data) => {
    if (!validatePhoneNumber(data.mobile)) {
      setError("mobile", { type: "manual", message: "Invalid phone number format." });
      return;
    }

    try {
      setIsLoading(true);
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      await apiSendOtp(data.mobile);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      Swal.fire({
        title: "Success",
        text: "OTP sent to your phone number",
        icon: "success",
        customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
      });
      setPhoneNumber(data.mobile);
      setIsOtpSent(true);
    } catch (error) {
      Swal.fire({
        title: "Oops! Something went wrong",
        text: "New number is the same as current or This Number already exists",
        icon: "warning",
        customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index, value) => {
    const newCode = [...otp];
    newCode[index] = value.slice(0, 1);
    setOtp(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const newMobile = otp.join("");

    if (newMobile.length < 6) {
      Swal.fire({
        title: "Error",
        text: "Please enter a complete 6-digit code.",
        icon: "error",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      return;
    }
    try {
      setIsLoading(true);
      await apiVerifyOtp(phoneNumber, otp);
      Swal.fire({
        title: "Success",
        text: "Phone number updated successfully!",
        icon: "success",
        customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
      });
      setPhoneNumber("");
    //   setOtp("");
      setOtp(Array(6).fill("")); 
      setIsOtpSent(false);
    } catch (error) {
      Swal.fire({
        title: "Oops! Something went wrong",
        text: "Invalid OTP. Please try again.",
        icon: "warning",
        customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackEdit = () => {
    if (isOtpSent) {
      setIsOtpSent(false);
    } else {
      navigate(`/${path.MEMBER}/${path.PERSONAL}`);
    }
  };

  return (
    <div className="flex flex-col p-4">
        {isOtpSent && (
        <div className="flex text-3xl font-bold px-6">
          <IoReturnDownBackOutline
            className="cursor-pointer hover:text-[#273526]"
            onClick={handleBackEdit}
          />
        </div>
      )}
      <div className="flex flex-col items-center">
        <h3 className="art-word-shadow">Update</h3>
        <h3 className="gradient-text -mt-8">Phone Number</h3>
      </div>

      {!isOtpSent ? (
        <form
          onSubmit={handleSubmit(handleSendOtp)}
          className="flex flex-col w-full max-w-md mb-4 mx-auto"
        >
          <InputForm
            label="New Phone Number"
            register={register}
            errors={errors}
            id="mobile"
            validate={{
              required: "Phone number is required",
              pattern: {
                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm, // Kiểm tra số điện thoại với 10 chữ số
                message: "Invalid phone number format",
              },
            }}
            fullWidth
            style="rounded-md mb-2"
          />
          <div className="flex gap-2 justify-end">
            <Button type="submit" name="Send Verification Code" />
            <Button
              onClick={handleBackEdit}
              name="Cancel"
              style="px-4 py-2 bg-black rounded-md text-white items-center justify-center my-2"
            />
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center">
          {/* <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="rounded-md p-2 border mb-4 w-full max-w-md"
          /> */}
           <div className="flex gap-2 mb-4">
          {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            id={`code-input-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-12 h-12 text-center border border-gray-300 rounded"
          />
        ))}
        </div>
          <button onClick={handleVerifyOtp} disabled={isLoading} className="bg-blue-500 text-white rounded-md px-4 py-2">
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdatePhoneNumber;
