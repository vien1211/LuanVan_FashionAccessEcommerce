import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, InputForm, Loading } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/avtDefault.avif";
import { apiUpdateCurrent } from "../../apis";
import { getCurrentUser } from "../../store/user/asyncActions";
import Swal from "sweetalert2";
import { showModal } from "../../store/app/appSlice";
import { getBase64 } from "../../ultils/helper";
import icons from "../../ultils/icons";
import { GoVerified } from "react-icons/go";
import { useNavigate, useSearchParams } from "react-router-dom";
import path from "../../ultils/path";

const { CiEdit } = icons;

const Personal = () => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useForm();
  const { current } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [preview, setPreview] = useState({
    avatar: current?.avatar || avatar,
  });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      mobile: current?.mobile,
      email: current?.email,
      avatar: current?.avatar,
      address: current?.address,
    });
  }, [current]);

  const handleUpdate = async (data) => {
    const formData = new FormData();

    // Append avatar if it exists
    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }
    delete data.avatar;

    // Append other form data
    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }

    // Debugging: Log each entry in formData
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdateCurrent(formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        dispatch(getCurrentUser()); // Ensure this is a function call
        Swal.fire({
          title: "Updated",
          text: "Update User Successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
        if (searchParams.get("redirect"))
          navigate(searchParams.get("redirect"));
      } else {
        Swal.fire({
          title: "Oops!",
          text: "Failed to Update User!",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
            confirmButton: "custom-confirm-button",
          },
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        title: "Oops!",
        text: "Failed to Update User!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePreview = async (files) => {
    const imgPreview = [];
    for (let file of files) {
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpg" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/avif" &&
        file.type !== "image/webp"
      ) {
        Swal.fire({
          title: "File not supported!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }
      const base64Image = await getBase64(file);
      imgPreview.push(base64Image);
    }

    // Set the preview image
    setPreview((prev) => ({ ...prev, avatar: imgPreview[0] }));
  };

  const [hoverAvatar, setHoverAvatar] = useState(false); // Change data type from null to boolean

  const handleCancel = () => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      mobile: current?.mobile,
      email: current?.email,
      avatar: current?.avatar,
      address: current?.address,
    });
    setPreview({ avatar: current?.avatar || avatar });
  };

  const handleEditEmail = () => {
    navigate(`/${path.MEMBER}/${path.UPDATE_EMAIL}`);
  };

  const handleEditPhoneNumber = () => {
    navigate(`/${path.MEMBER}/${path.UPDATE_PHONE_NUMBER}`);
  };

  const handleChangePassword = () => {
    navigate(`/${path.MEMBER}/${path.CHANGE_PASSWORD}`);
  };

  // const handleContactShop = () => {
  //   // You can implement your contact logic here, e.g., open a contact form/modal
  //   Swal.fire({
  //     title: "Contact Shop",
  //     text: "Please contact support at support@example.com.",
  //     icon: "info",
  //     confirmButtonText: "OK",
  //   });
  // };

  const handleContactShop = () => {
    Swal.fire({
      title: "Contact Shop",
      html: `<p style='color: #333; font-size: 16px;'>Please enter your message below. We will respond to your registered email: <strong>${current.email}</strong></p>`,
      input: "textarea",
      inputPlaceholder: "Write your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
      confirmButtonText: "Send",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      customClass: {
        title: "custom-title",
        text: "custom-text",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
      preConfirm: (message) => {
        if (!message) {
          Swal.showValidationMessage(
            "<i style='color: red;'>Message cannot be empty.</i>"
          );
        }
        return message;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const userMessage = result.value;

        // Send the message to Web3Forms API
        const formData = new FormData();
        formData.append("email", current.email);
        formData.append("message", userMessage);

        // Get the API key from the environment variable
        const web3FormsAPIKey = process.env.REACT_APP_WEB3FORMS_API_KEY;

        // Add the access_key parameter to the formData
        formData.append("access_key", web3FormsAPIKey);

        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              Swal.fire({
                title: "<h3 style='color: #4CAF50;'>Message Sent</h3>",
                html: "<p style='font-size: 16px;'>Thank you! Our support team will reach out to you soon.</p>",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                  title: "custom-title",
                  text: "custom-text",
                  confirmButton: "custom-confirm-button",
                },
              });
            } else {
              throw new Error("Error sending message: " + data.message);
            }
          })
          .catch((error) => {
            console.error("Error sending message:", error);
            Swal.fire({
              title: "Error",
              html: "<p style='font-size: 16px;'>There was an issue sending your message. Please try again later.</p>",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  return (
    <div className="w-full grid grid-cols-2 gap-4 px-4 py-2">
      <div className="flex flex-col ">
        <header className="text-3xl font-bold px-6 mt-3">
          Personal Information
        </header>

        <div className="p-4 border-r">
          <form
            onSubmit={handleSubmit(handleUpdate)}
            className="w-full mx-auto gap-3"
          >
            <div className="flex">
              <InputForm
                label="Firstname"
                register={register}
                errors={errors}
                id="firstname"
                validate={{
                  required: "Require",
                }}
                fullWidth
                style="rounded-md px-2 mb-2 flex-auto"
              />
              <InputForm
                label="Lastname"
                register={register}
                errors={errors}
                id="lastname"
                validate={{
                  required: "Require",
                }}
                fullWidth
                style="rounded-md px-2 mb-2 flex-auto"
              />
            </div>

            <div className="relative">
              <InputForm
                label="Email"
                register={register}
                errors={errors}
                id="email"
                validate={{
                  required: "Require",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address",
                  },
                }}
                readOnly={true}
                fullWidth
                style="rounded-md px-2 mb-2"
              />
              <span
                onClick={handleEditEmail}
                className="absolute top-2 right-2 cursor-pointer"
              >
                <CiEdit size={20} className="text-main" />
              </span>
            </div>

            <div className="relative">
              <InputForm
                label="Number Phone"
                register={register}
                errors={errors}
                id="mobile"
                validate={{
                  // required: "Require",
                  pattern: {
                    value:
                      // /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
                      /^\+84\d{9}$/,
                    message: "invalid phone number",
                  },
                }}
                readOnly={true}
                fullWidth
                style="rounded-md px-2 mb-2"
              />
              <span
                onClick={handleEditPhoneNumber}
                className="absolute top-2 right-2 cursor-pointer"
              >
                <CiEdit size={20} className="text-main" />
              </span>
            </div>
            <InputForm
              label="Address"
              register={register}
              errors={errors}
              id="address"
              // validate={{
              //   required: "Require",
              // }}
              fullWidth
              style="rounded-md px-2 mb-2"
            />

            <div className="flex flex-col px-2 gap-3">
              <div className="flex flex-col bg-white border border-main rounded-md px-2 py-2">
                <div className="flex gap-1 items-center">
                  <span className="font-medium">Account Status: </span>
                  <span> {current?.isBlocked ? "Blocked" : "Active"}</span>
                  <GoVerified className="ml-1"/>
                </div>
                <span className="flex items-start">
                  {current?.isBlocked && (
                    <Button
                      style="bg-red-500 text-white text-[11px] rounded-md px-1"
                      type="button"
                      name="Contact Support"
                      onClick={handleContactShop}
                    />
                  )}
                </span>
              </div>

              <div className="relative flex items-center px-2 gap-2 bg-[#d18356] text-white w-fit py-2 rounded-md cursor-pointer hover:bg-opacity-90">
                <span onClick={handleChangePassword} className="font-medium">
                  Change Password{" "}
                </span>
                <CiEdit size={20} className="text-white" />
              </div>
            </div>

            {isDirty && (
              <div className="flex justify-end gap-4 mr-2">
                <Button type="submit" name="Update Information" />
                <Button
                  style="bg-black px-2 py-2 justify-center my-2 rounded-md text-white"
                  type="button"
                  name="Cancel"
                  onClick={handleCancel}
                />
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="col-span-1 gap-2 flex justify-center items-center">
        <div
          className="relative"
          onMouseEnter={() => setHoverAvatar(true)}
          onMouseLeave={() => setHoverAvatar(false)}
        >
          <label htmlFor="file" className="cursor-pointer">
            <img
              src={preview.avatar}
              alt="avatar"
              className={`w-[300px] h-[300px] border-2 border-main object-cover rounded-full`}
            />

            <div className="absolute bottom-4 right-4 flex cursor-pointer justify-center items-center bg-[#1c1c1c42] rounded-full p-2">
              <span className="text-white bg-main rounded-full p-2">
                <CiEdit size={24} />
              </span>
            </div>
          </label>
          <input
            type="file"
            id="file"
            {...register("avatar", {
              onChange: (e) => handlePreview(e.target.files),
            })}
            hidden
          />
        </div>
      </div>
    </div>
  );
};

export default Personal;
