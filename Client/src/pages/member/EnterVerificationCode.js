// import React, { useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Button, CountDown } from "../../components";
// import { apiVerifyCodeAndUpdateEmail } from "../../apis";
// import Swal from "sweetalert2";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import path from "../../ultils/path";
// import { useDispatch } from "react-redux";
// import { getCurrentUser } from "../../store/user/asyncActions";

// const EnterVerificationCode = ({ email, onEmailUpdated }) => {
//   const { handleSubmit } = useForm();
//   const navigate = useNavigate();
//   const [code, setCode] = useState(Array(6).fill(""));
//   const [searchParams] = useSearchParams();
//   const dispatch = useDispatch();
//   const inputRefs = useRef([]);

//   const handleChange = (index, value) => {
//     const newCode = [...code];
//     newCode[index] = value.slice(0, 1);
//     setCode(newCode);

//     if (value && index < 5) {
//       inputRefs.current[index + 1].focus();
//     } else if (!value && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handleVerifyCode = async () => {
//     const verificationCode = code.join("");

//     if (verificationCode.length < 6) {
//       Swal.fire({
//         title: "Error",
//         text: "Please enter a complete 6-digit code.",
//         icon: "error",
//         customClass: {
//           title: "custom-title",
//           text: "custom-text",
//           confirmButton: "custom-confirm-button",
//         },
//       });
//       return;
//     }

//     try {
//       const response = await apiVerifyCodeAndUpdateEmail({ email, verificationCode });

//       if (response.success) {
//         dispatch(getCurrentUser());
//         Swal.fire({
//           title: "Updated",
//           text: "Your email has been updated successfully.",
//           icon: "success",
//           customClass: {
//             title: "custom-title",
//             text: "custom-text",
//             confirmButton: "custom-confirm-button",
//           },
//         });

//         onEmailUpdated && onEmailUpdated(email);

//         const redirectPath = searchParams.get("redirect") || `/${path.MEMBER}/${path.PERSONAL}`;
//         navigate(redirectPath);

//       } else {
//         Swal.fire({
//           title: "Error",
//           text: "Invalid code. Please try again.",
//           icon: "error",
//           customClass: {
//             title: "custom-title",
//             text: "custom-text",
//             confirmButton: "custom-confirm-button",
//           },
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         title: "Error",
//         text: error.response?.data?.message || "An unexpected error occurred.",
//         icon: "error",
//         customClass: {
//           title: "custom-title",
//           text: "custom-text",
//           confirmButton: "custom-confirm-button",
//         },
//       });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(handleVerifyCode)} className="flex flex-col items-center">
//       <div className="flex space-x-2 mb-4">
//         {code.map((digit, index) => (
//           <input
//             key={index}
//             ref={(el) => (inputRefs.current[index] = el)}
//             id={`code-input-${index}`}
//             type="text"
//             maxLength="1"
//             value={digit}
//             onChange={(e) => handleChange(index, e.target.value)}
//             className="w-12 h-12 text-center border border-gray-300 rounded"
//           />
//         ))}
//       </div>

//       <Button type="submit" name="Verify and Update Email" />
//     </form>
//   );
// };

// export default EnterVerificationCode;

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components";
import { apiVerifyCodeAndUpdateEmail } from "../../apis";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import path from "../../ultils/path";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../../store/user/asyncActions";
import { IoReturnDownBackOutline } from "react-icons/io5";

const EnterVerificationCode = ({ email, timeLeft }) => {
  const { handleSubmit } = useForm();
  const navigate = useNavigate();
  const [code, setCode] = useState(Array(6).fill(""));
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);

  // Timer state
  const [timer, setTimer] = useState(timeLeft);

  // Start the countdown when `timeLeft` is set
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            Swal.fire({
              title: "Code Expired",
              text: "The verification code has expired. Please request a new one.",
              icon: "warning",
              customClass: {
                title: "custom-title",
                text: "custom-text",
                confirmButton: "custom-confirm-button",
              },
            });
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length < 6) {
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
      const response = await apiVerifyCodeAndUpdateEmail({
        email,
        verificationCode,
      });

      if (response.success) {
        dispatch(getCurrentUser());
        Swal.fire({
          title: "Updated",
          text: "Your email has been updated successfully.",
          icon: "success",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });

        // onEmailUpdated && onEmailUpdated(email);

        const redirectPath =
          searchParams.get("redirect") || `/${path.MEMBER}/${path.PERSONAL}`;
        navigate(redirectPath);
      } else {
        Swal.fire({
          title: "Error",
          text: "Invalid code. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "An unexpected error occurred.",
        icon: "error",
      });
    }
  };

  const handleBackEdit = () => {
    navigate(`/${path.MEMBER}/${path.PERSONAL}`);
  };

  return (
    
    <form
      onSubmit={handleSubmit(handleVerifyCode)}
      className="flex flex-col items-center"
    >
      <div className="flex space-x-2 mb-4">
        {code.map((digit, index) => (
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

      {/* Countdown Timer */}
      <div className="mb-4 text-red-500">
        Code expires in {formatTime(timer)}
      </div>

      <Button
        type="submit"
        name="Verify and Update Email"
        disabled={timeLeft === 0}
      />
    </form>
  );
};

export default EnterVerificationCode;
