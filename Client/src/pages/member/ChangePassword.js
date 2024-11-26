// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Button, InputForm, Loading } from "../../components";
// import Swal from "sweetalert2";
// import { apiChangePassword } from "../../apis"; // Ensure this API function is created
// import { useDispatch, useSelector } from "react-redux";
// import { showModal } from "../../store/app/appSlice";
// import icons from "../../ultils/icons";
// import path from "../../ultils/path";
// import { useNavigate, useSearchParams } from "react-router-dom";

// const { IoEye, IoEyeOff } = icons;

// const ChangePassword = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm();
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const { current } = useSelector((state) => state.user);

//   const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
//   const [newPasswordVisible, setNewPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

//   const handlePasswordChange = async (data) => {
    
//     // Check if passwords match before sending to the API
//     if (data.oldPassword != data.password) {
//       Swal.fire({
//         title: "Current Password Incorrect",
//         text: "Please Enter Correctly",
//         icon: "warning",
//         customClass: {
//           title: "custom-title",
//           text: "custom-text",
//           confirmButton: "custom-confirm-button",
//         },
//       });
//       return;
//     }

//     setLoading(true);
//     dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));

//     try {
//       const response = await apiChangePassword({
//         oldPassword: data.oldPassword,
//         newPassword: data.newPassword,
//       });

//       dispatch(showModal({ isShowModal: false, modalChildren: null }));
//       setLoading(false);

//       if (response.success) {
//         Swal.fire({
//           title: "Success",
//           text: "Password changed successfully.",
//           icon: "success",
//           customClass: {
//             title: "custom-title",
//             text: "custom-text",
//             confirmButton: "custom-confirm-button",
//           },
//         });
//         const redirectPath =
//           searchParams.get("redirect") || `/${path.MEMBER}/${path.PERSONAL}`;
//         navigate(redirectPath);
//       } else {
//         // Show error from API response if the old password is incorrect
//         Swal.fire({
//           title: "Error",
//           text: response.message || "Incorrect old password. Please try again.",
//           icon: "error",
//           customClass: {
//             title: "custom-title",
//             text: "custom-text",
//             confirmButton: "custom-confirm-button",
//           },
//         });
//       }
//     } catch (error) {
//       setLoading(false);
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

//   const handleCancelChange = () => {
//       navigate(`/${path.MEMBER}/${path.PERSONAL}`);
//   };

//   return (
//     <div className="flex flex-col p-4">
//       <div className="flex flex-col items-center">
//         <h3 className="art-word-shadow">Change</h3>
//         <h3 className="gradient-text -mt-8">Password</h3>
//       </div>
//       <form
//         onSubmit={handleSubmit(handlePasswordChange)}
//         className="flex flex-col w-full max-w-md mx-auto"
//       >
//         <div className="w-full relative">
//           <InputForm
//             label="Current Password"
//             //   type="password"
//             type={currentPasswordVisible ? "text" : "password"}
//             register={register}
//             errors={errors}
//             id="oldPassword"
//             validate={{ required: "Current password is required" }}
//             fullWidth
//             style="rounded-md mb-2"
//           />
//           <button
//             type="button"
//             className="absolute right-3 top-[60%] transform -translate-y-1/2 z-10 text-main" // Adjust color as needed
//             onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
//           >
//             {currentPasswordVisible ? (
//               <IoEye size={20} />
//             ) : (
//               <IoEyeOff size={20} />
//             )}
//           </button>
//         </div>

//         <div className="w-full relative">
//           <InputForm
//             label="New Password"
//             //   type="password"
//             type={newPasswordVisible ? "text" : "password"}
//             register={register}
//             errors={errors}
//             id="newPassword"
//             validate={{
//               required: "New password is required",
//               minLength: {
//                 value: 6,
//                 message: "Password must be at least 6 characters long",
//               },
//               pattern: {
//                 value:
//                   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
//                 message:
//                   "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.",
//               },
//             }}
//             fullWidth
//             style="rounded-md mb-2"
//           />
//           <button
//             type="button"
//             className="absolute right-3 top-[60%] transform -translate-y-1/2 z-10 text-main" // Adjust color as needed
//             onClick={() => setNewPasswordVisible(!newPasswordVisible)}
//           >
//             {newPasswordVisible ? <IoEye size={20} /> : <IoEyeOff size={20} />}
//           </button>
//         </div>

//         <div className="w-full relative">
//           <InputForm
//             label="Confirm New Password"
//             //   type="password"
//             type={confirmPasswordVisible ? "text" : "password"}
//             register={register}
//             errors={errors}
//             id="confirmPassword"
//             validate={{
//               required: "Please confirm your new password",
//               validate: (value) =>
//                 value === watch("newPassword") || "Passwords do not match",
//             }}
//             fullWidth
//             style="rounded-md mb-2"
//           />
//           <button
//             type="button"
//             className="absolute right-3 top-[60%] transform -translate-y-1/2 z-10 text-main" // Adjust color as needed
//             onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
//           >
//              {confirmPasswordVisible ? <IoEye size={20} /> : <IoEyeOff size={20} />}
//           </button>
//         </div>

//         <div className="flex gap-2 justify-end">
//         <Button
//           type="submit"
//           name={"Confirm"}
//           disabled={loading}
//         />
//          <Button onClick={handleCancelChange} type="submit" name="Cancel" style="px-4 py-2 bg-black rounded-md text-white items-center justify-center my-2"/>
//          </div>
//       </form>
//     </div>
//   );
// };

// export default ChangePassword;



import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, InputForm, Loading } from "../../components";
import Swal from "sweetalert2";
import { apiChangePassword } from "../../apis"; // Ensure this API function is implemented
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import icons from "../../ultils/icons";
import path from "../../ultils/path";
import { useNavigate, useSearchParams } from "react-router-dom";

const { IoEye, IoEyeOff } = icons;

const ChangePassword = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handlePasswordChange = async (data) => {
    // Ensure new password is different from the old password
    if (data.oldPassword === data.newPassword) {
      Swal.fire({
        title: "Error",
        text: "New password must be different from the old password.",
        icon: "warning",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
      return;
    }

    setLoading(true);
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));

    try {
      const response = await apiChangePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      setLoading(false);

      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Password changed successfully.",
          icon: "success",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
        const redirectPath =
          searchParams.get("redirect") || `/${path.MEMBER}/${path.PERSONAL}`;
        navigate(redirectPath);
      } else {
        Swal.fire({
          title: "Error",
          text: response.message || "Incorrect old password. Please try again.",
          icon: "error",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "An unexpected error occurred.",
        icon: "error",
        customClass: {
          title: "custom-title",
          text: "custom-text",
          confirmButton: "custom-confirm-button",
        },
      });
    }
  };

  const handleCancelChange = () => {
    navigate(`/${path.MEMBER}/${path.PERSONAL}`);
  };

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-col items-center">
        <h3 className="art-word-shadow">Change</h3>
        <h3 className="gradient-text -mt-8">Password</h3>
      </div>
      <form
        onSubmit={handleSubmit(handlePasswordChange)}
        className="flex flex-col w-full max-w-md mx-auto"
      >
        <div className="w-full relative">
          <InputForm
            label="Current Password"
            type={currentPasswordVisible ? "text" : "password"}
            register={register}
            errors={errors}
            id="oldPassword"
            validate={{ required: "Current password is required" }}
            fullWidth
            style="rounded-md mb-2"
          />
          <button
            type="button"
            className="absolute right-3 top-[60%] transform -translate-y-1/2 z-10 text-main"
            onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
          >
            {currentPasswordVisible ? <IoEye size={20} /> : <IoEyeOff size={20} />}
          </button>
        </div>

        <div className="w-full relative">
          <InputForm
            label="New Password"
            type={newPasswordVisible ? "text" : "password"}
            register={register}
            errors={errors}
            id="newPassword"
            validate={{
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                message:
                  "Password must include uppercase, lowercase, number, and special character.",
              },
            }}
            fullWidth
            style="rounded-md mb-2"
          />
          <button
            type="button"
            className="absolute right-3 top-[60%] transform -translate-y-1/2 z-10 text-main"
            onClick={() => setNewPasswordVisible(!newPasswordVisible)}
          >
            {newPasswordVisible ? <IoEye size={20} /> : <IoEyeOff size={20} />}
          </button>
        </div>

        <div className="w-full relative">
          <InputForm
            label="Confirm New Password"
            type={confirmPasswordVisible ? "text" : "password"}
            register={register}
            errors={errors}
            id="confirmPassword"
            validate={{
              required: "Please confirm your new password",
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            }}
            fullWidth
            style="rounded-md mb-2"
          />
          <button
            type="button"
            className="absolute right-3 top-[60%] transform -translate-y-1/2 z-10 text-main"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            {confirmPasswordVisible ? <IoEye size={20} /> : <IoEyeOff size={20} />}
          </button>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="submit"
            name="Confirm"
            disabled={loading}
          />
          <Button
            onClick={handleCancelChange}
            type="button"
            name="Cancel"
            style="px-4 py-2 bg-black rounded-md text-white items-center justify-center my-2"
          />
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
